import "server-only";
import postgres from "postgres";
import { REVIEW_SCHEMA_SQL } from "@/review/lib/review-schema";
import type {
  CreateCommentInput,
  CreateReplyInput,
  ReviewComment,
  ReviewReply,
  ReviewStatus,
  ReviewTeam,
} from "@/review/types/review";

export const REVIEW_PROJECT = "nettle-website";

/** `REVIEW_ENVIRONMENT` wins; otherwise every Vercel deployment is "staging" and local runs are "development". */
export function getReviewEnvironment() {
  return process.env.REVIEW_ENVIRONMENT || (process.env.VERCEL ? "staging" : "development");
}

export class ReviewDatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not set");
  }
}

type CommentRow = {
  id: string;
  pathname: string;
  number: number;
  team: ReviewTeam;
  message: string;
  status: ReviewStatus;
  anchor_selector: string | null;
  relative_x: number;
  relative_y: number;
  relative_width: number;
  relative_height: number;
  fallback_x: number;
  fallback_y: number;
  fallback_width: number;
  fallback_height: number;
  viewport_width: number;
  viewport_height: number;
  created_at: Date;
  updated_at: Date;
};

type ReplyRow = {
  id: string;
  comment_id: string;
  team: ReviewTeam;
  message: string;
  created_at: Date;
};

// Reused across hot reloads (dev) and warm serverless invocations (Vercel).
const cache = globalThis as unknown as {
  reviewSql?: postgres.Sql;
  reviewSchema?: Promise<void>;
  reviewSchemaSql?: string;
};

async function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new ReviewDatabaseNotConfiguredError();

  // `prepare: false` keeps it compatible with pooled (PgBouncer) connection strings such as Neon's.
  const sql = (cache.reviewSql ??= postgres(url, { max: 5, idle_timeout: 20, prepare: false }));

  // Re-apply when the schema text changes (dev hot reload keeps globalThis alive).
  if (cache.reviewSchemaSql !== REVIEW_SCHEMA_SQL) {
    cache.reviewSchemaSql = REVIEW_SCHEMA_SQL;
    cache.reviewSchema = undefined;
  }
  cache.reviewSchema ??= applySchema(sql).catch((error) => {
    cache.reviewSchema = undefined;
    throw error;
  });
  await cache.reviewSchema;

  return sql;
}

/** Runs queries; a missing table (e.g. database reset while the server is warm) re-applies the schema next time. */
async function withSql<T>(run: (sql: postgres.Sql) => Promise<T>) {
  const sql = await getSql();
  try {
    return await run(sql);
  } catch (error) {
    if ((error as { code?: string }).code === "42P01") cache.reviewSchema = undefined;
    throw error;
  }
}

async function applySchema(sql: postgres.Sql) {
  try {
    await sql.unsafe(REVIEW_SCHEMA_SQL);
  } catch {
    // Two cold instances can race on `create table if not exists`; the second attempt sees the tables.
    await sql.unsafe(REVIEW_SCHEMA_SQL);
  }
}

function toReply(row: ReplyRow): ReviewReply {
  return {
    id: row.id,
    commentId: row.comment_id,
    team: row.team,
    message: row.message,
    createdAt: row.created_at.toISOString(),
  };
}

function toComment(row: CommentRow, replies: ReviewReply[]): ReviewComment {
  return {
    id: row.id,
    pathname: row.pathname,
    number: row.number,
    team: row.team,
    message: row.message,
    status: row.status,
    anchor: {
      anchorSelector: row.anchor_selector,
      relativeX: row.relative_x,
      relativeY: row.relative_y,
      relativeWidth: row.relative_width,
      relativeHeight: row.relative_height,
      fallbackX: row.fallback_x,
      fallbackY: row.fallback_y,
      fallbackWidth: row.fallback_width,
      fallbackHeight: row.fallback_height,
      viewportWidth: row.viewport_width,
      viewportHeight: row.viewport_height,
    },
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    replies,
  };
}

async function withReplies(sql: postgres.Sql, rows: CommentRow[]) {
  if (rows.length === 0) return [];

  const replyRows = await sql<ReplyRow[]>`
    select id, comment_id, team, message, created_at
    from review_replies
    where comment_id in ${sql(rows.map((row) => row.id))}
    order by created_at asc, id asc
  `;

  return rows.map((row) =>
    toComment(row, replyRows.filter((reply) => reply.comment_id === row.id).map(toReply)),
  );
}

export function listComments(pathname: string) {
  return withSql(async (sql) => {
    const rows = await sql<CommentRow[]>`
      select * from review_comments
      where project = ${REVIEW_PROJECT}
        and environment = ${getReviewEnvironment()}
        and pathname = ${pathname}
      order by created_at asc, id asc
    `;
    return withReplies(sql, rows);
  });
}

async function getComment(sql: postgres.Sql, id: string) {
  const rows = await sql<CommentRow[]>`
    select * from review_comments
    where id = ${id} and project = ${REVIEW_PROJECT} and environment = ${getReviewEnvironment()}
  `;
  const [comment] = await withReplies(sql, rows);
  return comment ?? null;
}

export function createComment({ pathname, team, message, anchor }: CreateCommentInput) {
  return withSql(async (sql) => {
    const environment = getReviewEnvironment();
    // Next number on this route. Two simultaneous submissions can share a number; acceptable for review notes.
    const [row] = await sql<CommentRow[]>`
      insert into review_comments (
        project, environment, pathname, number, team, message,
        anchor_selector, relative_x, relative_y, relative_width, relative_height,
        fallback_x, fallback_y, fallback_width, fallback_height,
        viewport_width, viewport_height
      ) values (
        ${REVIEW_PROJECT}, ${environment}, ${pathname},
        (
          select coalesce(max(number), 0) + 1 from review_comments
          where project = ${REVIEW_PROJECT} and environment = ${environment} and pathname = ${pathname}
        ),
        ${team}, ${message},
        ${anchor.anchorSelector}, ${anchor.relativeX}, ${anchor.relativeY},
        ${anchor.relativeWidth}, ${anchor.relativeHeight},
        ${anchor.fallbackX}, ${anchor.fallbackY}, ${anchor.fallbackWidth}, ${anchor.fallbackHeight},
        ${anchor.viewportWidth}, ${anchor.viewportHeight}
      )
      returning *
    `;
    return toComment(row, []);
  });
}

/** Returns the updated comment, or null when it does not exist in this project/environment. */
export function createReply(commentId: string, { team, message }: CreateReplyInput) {
  return withSql(async (sql) => {
    const inserted = await sql`
      with target as (
        update review_comments set updated_at = now()
        where id = ${commentId} and project = ${REVIEW_PROJECT} and environment = ${getReviewEnvironment()}
        returning id
      )
      insert into review_replies (comment_id, team, message)
      select id, ${team}, ${message} from target
      returning id
    `;
    if (inserted.length === 0) return null;
    return getComment(sql, commentId);
  });
}

/** Returns the updated comment, or null when it does not exist in this project/environment. */
export function setCommentStatus(commentId: string, status: ReviewStatus) {
  return withSql(async (sql) => {
    const updated = await sql`
      update review_comments set status = ${status}, updated_at = now()
      where id = ${commentId} and project = ${REVIEW_PROJECT} and environment = ${getReviewEnvironment()}
      returning id
    `;
    if (updated.length === 0) return null;
    return getComment(sql, commentId);
  });
}

/** Permanently deletes a comment and its replies (cascade). Returns false when it does not exist. */
export function deleteComment(commentId: string) {
  return withSql(async (sql) => {
    const deleted = await sql`
      delete from review_comments
      where id = ${commentId} and project = ${REVIEW_PROJECT} and environment = ${getReviewEnvironment()}
      returning id
    `;
    return deleted.length > 0;
  });
}
