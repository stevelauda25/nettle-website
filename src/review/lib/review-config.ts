import type { ReviewTeam } from "@/review/types/review";

/**
 * Review Mode switch. Inlined at build time, so it must be accessed exactly as
 * `process.env.NEXT_PUBLIC_REVIEW_MODE`. `?review=true` only opens the toolbar
 * when this is already enabled; it never overrides it.
 */
export const REVIEW_MODE_ENABLED = process.env.NEXT_PUBLIC_REVIEW_MODE === "true";

export const REVIEW_TEAMS: { id: ReviewTeam; label: string }[] = [
  { id: "blissful", label: "Blissful Team" },
  { id: "nettle", label: "Nettle Team" },
];

export const REVIEW_MESSAGE_MAX_LENGTH = 4000;

export function isReviewTeam(value: unknown): value is ReviewTeam {
  return REVIEW_TEAMS.some((team) => team.id === value);
}

export function reviewTeamLabel(team: ReviewTeam) {
  return REVIEW_TEAMS.find((item) => item.id === team)?.label ?? team;
}

/** Route key used to scope comments: no query/hash, no trailing slash (except "/"). */
export function normalizeReviewPathname(pathname: string) {
  const path = pathname.split(/[?#]/)[0] || "/";
  return path.length > 1 ? path.replace(/\/+$/, "") || "/" : path;
}
