import type {
  CreateCommentInput,
  CreateReplyInput,
  ReviewComment,
  ReviewStatus,
} from "@/review/types/review";

// Browser client for the /api/review route handlers.

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
  });
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (data as { error?: unknown } | null)?.error;
    throw new Error(typeof message === "string" ? message : `Request failed (${response.status})`);
  }
  return data as T;
}

export async function fetchComments(pathname: string) {
  const { comments } = await request<{ comments: ReviewComment[] }>(
    `/api/review/comments?pathname=${encodeURIComponent(pathname)}`,
  );
  return comments;
}

export async function postComment(input: CreateCommentInput) {
  const { comment } = await request<{ comment: ReviewComment }>("/api/review/comments", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return comment;
}

export async function postReply(commentId: string, input: CreateReplyInput) {
  const { comment } = await request<{ comment: ReviewComment }>(`/api/review/comments/${commentId}/replies`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return comment;
}

export async function patchCommentStatus(commentId: string, status: ReviewStatus) {
  const { comment } = await request<{ comment: ReviewComment }>(`/api/review/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return comment;
}
