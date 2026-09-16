import type { ReactNode } from "react";

type GridProps = {
  children: ReactNode;
  className?: string;
};

/**
 * The column grid. Always used inside <Container>, never on its own —
 * Container establishes the shared box, Grid divides it into columns.
 *
 * Column count/gutter come from --grid-columns / --grid-gutter (Figma).
 * Place children by column line — col-span-*, or col-start-* with col-end-*
 * — not by arbitrary width or margin. <GridBand> is available for children
 * that need
 * to re-expose the parent's exact column lines via CSS subgrid.
 */
export function Grid({ children, className = "" }: GridProps) {
  return (
    <div className={`grid grid-cols-[repeat(var(--grid-columns),minmax(0,1fr))] gap-x-[var(--grid-gutter)] ${className}`}>
      {children}
    </div>
  );
}
