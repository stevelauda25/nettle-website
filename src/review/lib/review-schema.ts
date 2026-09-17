/**
 * Review Mode database schema (Postgres 13+). Idempotent: applied automatically
 * on the first API request of each server instance (see `review-db.ts`).
 */
export const REVIEW_SCHEMA_SQL = `
create table if not exists review_comments (
  id uuid primary key default gen_random_uuid(),
  project text not null,
  environment text not null,
  pathname text not null,
  team text not null check (team in ('nettle', 'blissful')),
  message text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  anchor_selector text,
  relative_x double precision not null,
  relative_y double precision not null,
  relative_width double precision not null,
  relative_height double precision not null,
  fallback_x double precision not null,
  fallback_y double precision not null,
  fallback_width double precision not null,
  fallback_height double precision not null,
  viewport_width integer not null,
  viewport_height integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists review_comments_scope_idx
  on review_comments (project, environment, pathname, created_at);

create table if not exists review_replies (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references review_comments (id) on delete cascade,
  team text not null check (team in ('nettle', 'blissful')),
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists review_replies_comment_idx
  on review_replies (comment_id, created_at);
`;
