export type ReviewTeam = "nettle" | "blissful";

export type ReviewStatus = "open" | "resolved";

/**
 * Where an annotation sits on the page.
 *
 * - `anchorSelector` set: `relative*` are fractions of that element's box.
 * - `anchorSelector` null: `relative*` are fractions of the document size.
 * - `fallback*` are always document fractions; used when the anchor can no
 *   longer be found (e.g. the markup changed after a redeploy).
 */
export type AnnotationAnchor = {
  anchorSelector: string | null;
  relativeX: number;
  relativeY: number;
  relativeWidth: number;
  relativeHeight: number;
  fallbackX: number;
  fallbackY: number;
  fallbackWidth: number;
  fallbackHeight: number;
  viewportWidth: number;
  viewportHeight: number;
};

export type ReviewReply = {
  id: string;
  commentId: string;
  team: ReviewTeam;
  message: string;
  createdAt: string;
};

export type ReviewComment = {
  id: string;
  pathname: string;
  team: ReviewTeam;
  message: string;
  status: ReviewStatus;
  anchor: AnnotationAnchor;
  createdAt: string;
  updatedAt: string;
  replies: ReviewReply[];
};

export type CreateCommentInput = {
  pathname: string;
  team: ReviewTeam;
  message: string;
  anchor: AnnotationAnchor;
};

export type CreateReplyInput = {
  team: ReviewTeam;
  message: string;
};

/** Document-coordinate rectangle (CSS px from the top-left of the page). */
export type DocRect = { x: number; y: number; width: number; height: number };
