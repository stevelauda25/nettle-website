import "server-only";
import {
  REVIEW_MESSAGE_MAX_LENGTH,
  REVIEW_MODE_ENABLED,
  isReviewTeam,
  normalizeReviewPathname,
} from "@/review/lib/review-config";
import { ReviewDatabaseNotConfiguredError } from "@/review/lib/review-db";
import type { AnnotationAnchor, CreateReplyInput, ReviewStatus } from "@/review/types/review";

// Shared request parsing and responses for the /api/review route handlers.

export class ReviewRequestError extends Error {}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Runs a handler only when Review Mode is enabled, mapping known errors to JSON responses. */
export async function handleReviewRequest(handler: () => Promise<Response>) {
  if (!REVIEW_MODE_ENABLED) return new Response("Not Found", { status: 404 });

  try {
    return await handler();
  } catch (error) {
    if (error instanceof ReviewRequestError) return reviewJson({ error: error.message }, 400);
    if (error instanceof ReviewDatabaseNotConfiguredError) {
      return reviewJson({ error: "Review database is not configured (DATABASE_URL missing)." }, 503);
    }
    console.error("[review]", error);
    return reviewJson({ error: "Review request failed." }, 500);
  }
}

export function reviewJson(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") throw new ReviewRequestError("Expected a JSON object body.");
  return body as Record<string, unknown>;
}

export function parseCommentId(value: string) {
  if (!UUID_PATTERN.test(value)) throw new ReviewRequestError("Invalid comment id.");
  return value;
}

export function parsePathname(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/") || value.length > 512) {
    throw new ReviewRequestError("Invalid pathname.");
  }
  return normalizeReviewPathname(value);
}

export function parseStatus(value: unknown): ReviewStatus {
  if (value !== "open" && value !== "resolved") throw new ReviewRequestError("Invalid status.");
  return value;
}

export function parseMessageInput(body: Record<string, unknown>): CreateReplyInput {
  if (!isReviewTeam(body.team)) throw new ReviewRequestError("Invalid team.");
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > REVIEW_MESSAGE_MAX_LENGTH) {
    throw new ReviewRequestError(`Message must be 1–${REVIEW_MESSAGE_MAX_LENGTH} characters.`);
  }
  return { team: body.team, message };
}

function finite(value: unknown, name: string, min = -100, max = 100) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
    throw new ReviewRequestError(`Invalid anchor.${name}.`);
  }
  return value;
}

export function parseAnchor(value: unknown): AnnotationAnchor {
  if (!value || typeof value !== "object") throw new ReviewRequestError("Invalid anchor.");
  const anchor = value as Record<string, unknown>;
  const selector = anchor.anchorSelector;
  if (selector !== null && (typeof selector !== "string" || selector.length === 0 || selector.length > 1000)) {
    throw new ReviewRequestError("Invalid anchor.anchorSelector.");
  }

  return {
    anchorSelector: selector,
    relativeX: finite(anchor.relativeX, "relativeX"),
    relativeY: finite(anchor.relativeY, "relativeY"),
    relativeWidth: finite(anchor.relativeWidth, "relativeWidth", 0),
    relativeHeight: finite(anchor.relativeHeight, "relativeHeight", 0),
    fallbackX: finite(anchor.fallbackX, "fallbackX"),
    fallbackY: finite(anchor.fallbackY, "fallbackY"),
    fallbackWidth: finite(anchor.fallbackWidth, "fallbackWidth", 0),
    fallbackHeight: finite(anchor.fallbackHeight, "fallbackHeight", 0),
    viewportWidth: Math.round(finite(anchor.viewportWidth, "viewportWidth", 1, 100_000)),
    viewportHeight: Math.round(finite(anchor.viewportHeight, "viewportHeight", 1, 100_000)),
  };
}
