"use client";

import { REVIEW_UI_ATTRIBUTE } from "@/review/lib/annotation-positioning";
import { reviewTeamLabel } from "@/review/lib/review-config";
import { formatCommentTime, teamStyle } from "@/review/lib/review-format";
import type { ReviewComment, ReviewStatus } from "@/review/types/review";
import styles from "./review.module.css";

type CommentSidebarProps = {
  pathname: string;
  /** null while loading. */
  comments: ReviewComment[] | null;
  numbers: Map<string, number>;
  error: string | null;
  filter: ReviewStatus;
  onFilterChange: (filter: ReviewStatus) => void;
  selectedId: string | null;
  hoveredId: string | null;
  onHoverChange: (id: string | null) => void;
  onSelect: (comment: ReviewComment) => void;
  onClose: () => void;
};

const FILTERS: { id: ReviewStatus; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "resolved", label: "Resolved" },
];

export function CommentSidebar({
  pathname,
  comments,
  numbers,
  error,
  filter,
  onFilterChange,
  selectedId,
  hoveredId,
  onHoverChange,
  onSelect,
  onClose,
}: CommentSidebarProps) {
  const visible = comments?.filter((comment) => comment.status === filter) ?? [];

  return (
    <aside {...{ [REVIEW_UI_ATTRIBUTE]: "" }} className={`${styles.ui} ${styles.sidebar}`} aria-label="Review comments">
      <header className={styles.sidebarHeader}>
        <div>
          <h2 className={styles.sidebarTitle}>Comments</h2>
          <p className={styles.sidebarPath}>{pathname}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close comments" className={styles.iconButton}>
          ×
        </button>
      </header>

      <div className={styles.segmented} role="group" aria-label="Filter comments">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => onFilterChange(item.id)}
            className={styles.segment}
          >
            {item.label}
            <span className={styles.segmentCount}>
              {comments?.filter((comment) => comment.status === item.id).length ?? "–"}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className={`${styles.error} ${styles.sidebarError}`}>
          {error}
        </p>
      )}

      {comments === null ? (
        <p className={styles.empty}>Loading comments…</p>
      ) : visible.length === 0 ? (
        <p className={styles.empty}>
          {filter === "open" ? "No open comments on this page." : "No resolved comments on this page."}
        </p>
      ) : (
        <ul className={styles.list}>
          {visible.map((comment) => (
            <li key={comment.id}>
              <button
                type="button"
                onClick={() => onSelect(comment)}
                onMouseEnter={() => onHoverChange(comment.id)}
                onMouseLeave={() => onHoverChange(null)}
                aria-current={selectedId === comment.id}
                data-hovered={hoveredId === comment.id || undefined}
                className={styles.item}
              >
                <span className={styles.markerStatic} style={teamStyle(comment.team)}>
                  {numbers.get(comment.id)}
                </span>
                <span className={styles.itemContent}>
                  <span className={styles.itemMeta}>
                    <strong className={styles.messageAuthor}>{reviewTeamLabel(comment.team)}</strong>
                    <time dateTime={comment.createdAt}>{formatCommentTime(comment.createdAt)}</time>
                  </span>
                  <span className={styles.itemMessage}>{comment.message}</span>
                  {comment.replies.length > 0 && (
                    <span className={styles.itemReplies}>
                      {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
