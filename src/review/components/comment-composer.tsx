"use client";

import { MessageForm } from "@/review/components/message-form";
import type { ReviewTeam } from "@/review/types/review";
import styles from "./review.module.css";

type CommentComposerProps = {
  number: number;
  team: ReviewTeam | null;
  onTeamChange: (team: ReviewTeam) => void;
  onSubmit: (team: ReviewTeam, message: string) => Promise<void>;
  onCancel: () => void;
};

export function CommentComposer({ number, team, onTeamChange, onSubmit, onCancel }: CommentComposerProps) {
  return (
    <section className={styles.card} aria-label="New comment">
      <header className={styles.cardHeader}>
        <span className={styles.cardTitle}>New comment #{number}</span>
      </header>
      <div className={styles.cardFooter}>
        <MessageForm
          team={team}
          onTeamChange={onTeamChange}
          placeholder="Add a comment for this area…"
          submitLabel="Comment"
          onSubmit={onSubmit}
          onCancel={onCancel}
          autoFocus
        />
      </div>
    </section>
  );
}
