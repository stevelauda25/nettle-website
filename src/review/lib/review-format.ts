import type { CSSProperties } from "react";
import type { ReviewTeam } from "@/review/types/review";

// Review UI colours are deliberately separate from the Nettle design tokens.
const TEAM_COLORS: Record<ReviewTeam, string> = {
  blissful: "#7c5cff",
  nettle: "#0e9f6e",
};

export function teamStyle(team: ReviewTeam | null): CSSProperties {
  return { "--rv-team": team ? TEAM_COLORS[team] : "#0d99ff" } as CSSProperties;
}

const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function formatCommentTime(iso: string) {
  return dateTimeFormat.format(new Date(iso));
}
