import type { NextRequest } from "next/server";
import { deleteComment, setCommentStatus } from "@/review/lib/review-db";
import {
  handleReviewRequest,
  parseCommentId,
  parseStatus,
  readJson,
  reviewJson,
} from "@/review/lib/review-request";

/** PATCH /api/review/comments/:id — { status: "open" | "resolved" } (resolve / reopen). */
export function PATCH(request: NextRequest, ctx: RouteContext<"/api/review/comments/[id]">) {
  return handleReviewRequest(async () => {
    const id = parseCommentId((await ctx.params).id);
    const { status } = await readJson(request);
    const comment = await setCommentStatus(id, parseStatus(status));
    return comment ? reviewJson({ comment }) : reviewJson({ error: "Comment not found." }, 404);
  });
}

/** DELETE /api/review/comments/:id — permanently removes the comment and its replies. */
export function DELETE(_request: NextRequest, ctx: RouteContext<"/api/review/comments/[id]">) {
  return handleReviewRequest(async () => {
    const id = parseCommentId((await ctx.params).id);
    return (await deleteComment(id))
      ? reviewJson({ deleted: true })
      : reviewJson({ error: "Comment not found." }, 404);
  });
}
