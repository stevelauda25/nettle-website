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

/** Floating review control, bottom-right: white "Comment" pill, expanding into a small stacked card. */
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
      <div {...uiAttribute} className={`${styles.ui} ${styles.toolbar} ${styles.toolbarCollapsed}`}>
        <button
          type="button"
          onClick={() => onExpandedChange(true)}
          aria-label="Open review comments"
          className={styles.toggleButton}
        >
          <CommentIcon />
          Comment
        </button>
      </div>
    );
  }

  return (
    <div
      {...uiAttribute}
      role="group"
      aria-label="Review tools"
      className={`${styles.ui} ${styles.toolbar} ${styles.toolbarCard} ${sidebarOpen ? styles.toolbarBesideSidebar : ""}`}
    >
      <div className={styles.toolbarHeader}>
        <p className={styles.toolbarTitle}>Review</p>
        <button
          type="button"
          onClick={() => onExpandedChange(false)}
          aria-label="Close review tools"
          className={styles.iconButton}
        >
          ×
        </button>
      </div>

      <button
        type="button"
        aria-pressed={commentMode}
        onClick={() => onCommentModeChange(!commentMode)}
        title="Comment mode (C)"
        className={styles.toolbarRow}
      >
        <CommentIcon />
        <span className={styles.toolbarRowLabel}>Comment</span>
        <kbd className={styles.kbd} aria-hidden="true">
          C
        </kbd>
      </button>

      <button
        type="button"
        aria-pressed={sidebarOpen}
        onClick={() => onSidebarOpenChange(!sidebarOpen)}
        className={styles.toolbarRow}
      >
        <ListIcon />
        <span className={styles.toolbarRowLabel}>Comments</span>
        <span
          className={hasError ? styles.countError : styles.count}
          aria-label={hasError ? "Could not load comments" : `${openCount ?? 0} open`}
        >
          {hasError ? "!" : (openCount ?? "…")}
        </span>
      </button>

      <div className={styles.toolbarTeam}>
        <TeamSelect value={team} onChange={onTeamChange} />
      </div>
    </div>
  );
}
