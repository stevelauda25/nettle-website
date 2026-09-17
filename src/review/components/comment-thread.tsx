"use client";

import { useState } from "react";
import { MessageForm } from "@/review/components/message-form";
import { reviewTeamLabel } from "@/review/lib/review-config";
import { formatCommentTime, teamStyle } from "@/review/lib/review-format";
import type { ReviewComment, ReviewStatus, ReviewTeam } from "@/review/types/review";
import styles from "./review.module.css";

type CommentThreadProps = {
  comment: ReviewComment;
  number: number;
  attached: boolean;
  team: ReviewTeam | null;
  onTeamChange: (team: ReviewTeam) => void;
  onReply: (team: ReviewTeam, message: string) => Promise<void>;
  onSetStatus: (status: ReviewStatus) => Promise<void>;
  onClose: () => void;
};

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
  number,
  attached,
  team,
  onTeamChange,
  onReply,
  onSetStatus,
  onClose,
}: CommentThreadProps) {
  const [statusPending, setStatusPending] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const resolved = comment.status === "resolved";

  async function toggleStatus() {
    setStatusPending(true);
    setStatusError(null);
    try {
      await onSetStatus(resolved ? "open" : "resolved");
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : "Could not update status.");
    } finally {
      setStatusPending(false);
    }
  }

  return (
    <section className={styles.card} aria-label={`Comment ${number}`}>
      <header className={styles.cardHeader}>
        <span className={styles.markerStatic} style={teamStyle(comment.team)}>
          {number}
        </span>
        <span className={styles.cardTitle}>{resolved ? "Resolved" : "Open"}</span>
        <button type="button" onClick={toggleStatus} disabled={statusPending} className={styles.button}>
          {resolved ? "Reopen" : "Resolve"}
        </button>
        <button type="button" onClick={onClose} aria-label="Close thread" className={styles.iconButton}>
          ×
        </button>
      </header>

      <div className={styles.threadScroll}>
        {!attached && (
          <p className={styles.notice}>The original element was not found. Showing the approximate position.</p>
        )}
        {statusError && (
          <p role="alert" className={styles.error}>
            {statusError}
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
