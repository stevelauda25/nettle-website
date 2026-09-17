import type { NextRequest } from "next/server";
import { createComment, listComments } from "@/review/lib/review-db";
import {
  handleReviewRequest,
  parseAnchor,
  parseMessageInput,
  parsePathname,
  readJson,
  reviewJson,
} from "@/review/lib/review-request";

/** GET /api/review/comments?pathname=/ — comments (with replies) for one route. */
export function GET(request: NextRequest) {
  return handleReviewRequest(async () => {
    const pathname = parsePathname(request.nextUrl.searchParams.get("pathname"));
    return reviewJson({ comments: await listComments(pathname) });
  });
}

/** POST /api/review/comments — create an area comment. */
export function POST(request: NextRequest) {
  return handleReviewRequest(async () => {
    const body = await readJson(request);
    const comment = await createComment({
      pathname: parsePathname(body.pathname),
      anchor: parseAnchor(body.anchor),
      ...parseMessageInput(body),
    });
    return reviewJson({ comment }, 201);
  });
}
