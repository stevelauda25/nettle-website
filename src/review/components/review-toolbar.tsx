"use client";

import { TeamSelect } from "@/review/components/team-select";
import { REVIEW_UI_ATTRIBUTE } from "@/review/lib/annotation-positioning";
import type { ReviewTeam } from "@/review/types/review";
import styles from "./review.module.css";

type ReviewToolbarProps = {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  commentMode: boolean;
  onCommentModeChange: (active: boolean) => void;
  team: ReviewTeam | null;
  onTeamChange: (team: ReviewTeam) => void;
  sidebarOpen: boolean;
  onSidebarOpenChange: (open: boolean) => void;
  openCount: number | null;
  hasError: boolean;
};

function CommentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 3.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1H7l-3 2.5V11h-.5a1 1 0 0 1-1-1V3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 4.5h10M3 8h10M3 11.5h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Floating review control: collapsed "Review" pill, or Comment / Team / Comments. */
export function ReviewToolbar({
  expanded,
  onExpandedChange,
  commentMode,
  onCommentModeChange,
  team,
  onTeamChange,
  sidebarOpen,
  onSidebarOpenChange,
  openCount,
  hasError,
}: ReviewToolbarProps) {
  const uiAttribute = { [REVIEW_UI_ATTRIBUTE]: "" };

  if (!expanded) {
    return (
      <div {...uiAttribute} className={`${styles.ui} ${styles.toolbar}`}>
        <button type="button" onClick={() => onExpandedChange(true)} className={styles.toolbarButton}>
          <CommentIcon />
          Review
        </button>
      </div>
    );
  }

  return (
    <div {...uiAttribute} role="toolbar" aria-label="Review tools" className={`${styles.ui} ${styles.toolbar}`}>
      <button
        type="button"
        aria-pressed={commentMode}
        onClick={() => onCommentModeChange(!commentMode)}
        title="Comment mode (C)"
        aria-label="Comment mode"
        className={styles.toolbarButton}
      >
        <CommentIcon />
        <span className={styles.toolbarLabel}>Comment</span>
      </button>
      <TeamSelect value={team} onChange={onTeamChange} variant="dark" />
      <button
        type="button"
        aria-pressed={sidebarOpen}
        onClick={() => onSidebarOpenChange(!sidebarOpen)}
        aria-label="Comments"
        className={styles.toolbarButton}
      >
        <ListIcon />
        <span className={styles.toolbarLabel}>Comments</span>
        <span className={hasError ? styles.countError : styles.count}>{hasError ? "!" : (openCount ?? "…")}</span>
      </button>
      <button
        type="button"
        onClick={() => onExpandedChange(false)}
        aria-label="Close review tools"
        className={styles.toolbarIcon}
      >
        ×
      </button>
    </div>
  );
}
