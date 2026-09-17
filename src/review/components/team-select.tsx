"use client";

import { REVIEW_TEAMS, isReviewTeam } from "@/review/lib/review-config";
import type { ReviewTeam } from "@/review/types/review";
import styles from "./review.module.css";

type TeamSelectProps = {
  value: ReviewTeam | null;
  onChange: (team: ReviewTeam) => void;
  variant?: "light" | "dark";
};

export function TeamSelect({ value, onChange, variant = "light" }: TeamSelectProps) {
  return (
    <label className={styles.teamField}>
      <span className={variant === "dark" ? styles.srOnly : styles.fieldLabel}>Team</span>
      <select
        value={value ?? ""}
        onChange={(event) => {
          if (isReviewTeam(event.target.value)) onChange(event.target.value);
        }}
        className={variant === "dark" ? styles.selectDark : styles.select}
        required
      >
        <option value="" disabled>
          Choose team
        </option>
        {REVIEW_TEAMS.map((team) => (
          <option key={team.id} value={team.id}>
            {team.label}
          </option>
        ))}
      </select>
    </label>
  );
}
