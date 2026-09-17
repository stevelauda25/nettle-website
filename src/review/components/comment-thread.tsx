"use client";

import { useState } from "react";
import { MessageForm } from "@/review/components/message-form";
import { reviewTeamLabel } from "@/review/lib/review-config";
import { formatCommentTime, teamStyle } from "@/review/lib/review-format";
import type { ReviewComment, ReviewStatus, ReviewTeam } from "@/review/types/review";
import styles from "./review.module.css";

type CommentThreadProps = {
  comment: ReviewComment;
  attached: boolean;
  team: ReviewTeam | null;
  onTeamChange: (team: ReviewTeam) => void;
  onReply: (team: ReviewTeam, message: string) => Promise<void>;
  onSetStatus: (status: ReviewStatus) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
};

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5M6.8 7v3.5M9.2 7v3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThreadMessage({ team, message, createdAt }: { team: ReviewTeam; message: string; createdAt: string }) {
  return (
    <article className={styles.message}>
      <div className={styles.messageMeta}>
        <span className={styles.teamDot} style={teamStyle(team)} aria-hidden="true" />
        <strong className={styles.messageAuthor}>{reviewTeamLabel(team)}</strong>
        <time dateTime={createdAt}>{formatCommentTime(createdAt)}</time>
      </div>
      <p className={styles.messageBody}>{message}</p>
    </article>
  );
}

export function CommentThread({
  comment,
  attached,
  team,
  onTeamChange,
  onReply,
  onSetStatus,
  onDelete,
  onClose,
}: CommentThreadProps) {
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const resolved = comment.status === "resolved";

  async function runAction(action: () => Promise<void>, failure: string) {
    setPending(true);
    setActionError(null);
    try {
      await action();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : failure);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={styles.card} aria-label={`Comment ${comment.number}`}>
      <header className={styles.cardHeader}>
        <span className={styles.markerStatic} style={teamStyle(comment.team)}>
          {comment.number}
        </span>
        <span className={styles.cardTitle}>{resolved ? "Resolved" : "Open"}</span>
        <button
          type="button"
          onClick={() => runAction(() => onSetStatus(resolved ? "open" : "resolved"), "Could not update status.")}
          disabled={pending}
          className={styles.button}
        >
          {resolved ? "Reopen" : "Resolve"}
        </button>
        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          disabled={pending}
          aria-label="Delete comment"
          title="Delete comment"
          className={styles.iconButton}
        >
          <TrashIcon />
        </button>
        <button type="button" onClick={onClose} aria-label="Close thread" className={styles.iconButton}>
          ×
        </button>
      </header>

      {confirmingDelete && (
        <div className={styles.confirm} role="alertdialog" aria-label="Delete comment">
          <p className={styles.confirmText}>
            Delete comment #{comment.number}
            {comment.replies.length > 0 &&
              ` and ${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
            ? This can’t be undone.
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={pending}
              className={styles.button}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => runAction(onDelete, "Could not delete comment.")}
              disabled={pending}
              className={styles.buttonDanger}
            >
              {pending ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      )}

      <div className={styles.threadScroll}>
        {!attached && (
          <p className={styles.notice}>The original element was not found. Showing the approximate position.</p>
        )}
        {actionError && (
          <p role="alert" className={styles.error}>
            {actionError}
          </p>
        )}
        <ThreadMessage team={comment.team} message={comment.message} createdAt={comment.createdAt} />
        {comment.replies.map((reply) => (
          <ThreadMessage key={reply.id} team={reply.team} message={reply.message} createdAt={reply.createdAt} />
        ))}
      </div>

      <div className={styles.cardFooter}>
        <MessageForm
          team={team}
          onTeamChange={onTeamChange}
          placeholder="Reply…"
          submitLabel="Reply"
          onSubmit={onReply}
        />
      </div>
    </section>
  );
}
