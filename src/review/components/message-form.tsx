"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { TeamSelect } from "@/review/components/team-select";
import { REVIEW_MESSAGE_MAX_LENGTH } from "@/review/lib/review-config";
import type { ReviewTeam } from "@/review/types/review";
import styles from "./review.module.css";

type MessageFormProps = {
  team: ReviewTeam | null;
  onTeamChange: (team: ReviewTeam) => void;
  placeholder: string;
  submitLabel: string;
  onSubmit: (team: ReviewTeam, message: string) => Promise<void>;
  onCancel?: () => void;
  autoFocus?: boolean;
};

/** Team + textarea + actions. Shared by the new-comment composer and the reply composer. */
export function MessageForm({
  team,
  onTeamChange,
  placeholder,
  submitLabel,
  onSubmit,
  onCancel,
  autoFocus = false,
}: MessageFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSubmit = team !== null && message.trim().length > 0 && !pending;

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit || !team) return;

    setPending(true);
    setError(null);
    try {
      await onSubmit(team, message.trim());
      setMessage("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onKeyDown={(event) => {
        // From any field (validation may move focus to the team select).
        if (event.key === "Escape" && onCancel) {
          event.preventDefault();
          onCancel();
        }
      }}
    >
      <TeamSelect value={team} onChange={onTeamChange} />
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        maxLength={REVIEW_MESSAGE_MAX_LENGTH}
        rows={3}
        className={styles.textarea}
      />
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      <div className={styles.actions}>
        {onCancel && (
          <button type="button" onClick={onCancel} className={styles.button}>
            Cancel
          </button>
        )}
        <button type="submit" disabled={!canSubmit} className={styles.buttonPrimary}>
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
