import type { ReactNode } from "react";

type GridBandProps = {
  children: ReactNode;
  className?: string;
};

/**
 * A horizontal region that spans every column of the parent <Grid> and
 * re-exposes those exact column lines via `grid-template-columns: subgrid`
 * (see .grid-band in globals.css, with a non-subgrid fallback).
 *
 * Use this when a section has multiple rows/regions that must snap to the
 * SAME column lines as each other — e.g. a heading row and a card row —
 * rather than each computing its own independent 1fr tracks.
 */
export function GridBand({ children, className = "" }: GridBandProps) {
  return <div className={`grid-band ${className}`}>{children}</div>;
}
