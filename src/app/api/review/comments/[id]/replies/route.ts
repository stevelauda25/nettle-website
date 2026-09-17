import type { NextRequest } from "next/server";
import { createReply } from "@/review/lib/review-db";
import {
  handleReviewRequest,
  parseCommentId,
  parseMessageInput,
  readJson,
  reviewJson,
} from "@/review/lib/review-request";

/** POST /api/review/comments/:id/replies — { team, message }; returns the updated comment. */
export function POST(request: NextRequest, ctx: RouteContext<"/api/review/comments/[id]/replies">) {
  return handleReviewRequest(async () => {
    const id = parseCommentId((await ctx.params).id);
    const comment = await createReply(id, parseMessageInput(await readJson(request)));
    return comment ? reviewJson({ comment }, 201) : reviewJson({ error: "Comment not found." }, 404);
  });
}
