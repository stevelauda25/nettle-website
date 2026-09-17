"use client";

import { teamStyle } from "@/review/lib/review-format";
import type { DocRect, ReviewTeam } from "@/review/types/review";
import styles from "./review.module.css";

type AnnotationBoxProps = {
  rect: DocRect;
  team: ReviewTeam | null;
  number?: number;
  variant?: "open" | "resolved" | "draft";
  hovered?: boolean;
  selected?: boolean;
  detached?: boolean;
  onMarkerClick?: () => void;
  onHoverChange?: (hovered: boolean) => void;
};

/** Highlighted area + numbered marker. Only the marker takes pointer events, so the page stays usable. */
export function AnnotationBox({
  rect,
  team,
  number,
  variant = "open",
  hovered = false,
  selected = false,
  detached = false,
  onMarkerClick,
  onHoverChange,
}: AnnotationBoxProps) {
  const className = [
    styles.box,
    variant === "resolved" && styles.boxResolved,
    variant === "draft" && styles.boxDraft,
    detached && styles.boxDetached,
    hovered && styles.boxHovered,
    selected && styles.boxSelected,
  ]
    .filter(Boolean)
    .join(" ");

  // Keep the marker inside the area when it would overflow the page edge.
  const markerInside = rect.x + rect.width + 14 > document.documentElement.clientWidth || rect.y < 14;

  return (
    <div
      className={className}
      style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height, ...teamStyle(team) }}
      data-review-annotation={number}
    >
      {number !== undefined &&
        (onMarkerClick ? (
          <button
            type="button"
            className={`${styles.marker} ${markerInside ? styles.markerInside : ""}`}
            aria-label={`Comment ${number}`}
            aria-expanded={selected}
            onClick={onMarkerClick}
            onMouseEnter={() => onHoverChange?.(true)}
            onMouseLeave={() => onHoverChange?.(false)}
            onFocus={() => onHoverChange?.(true)}
            onBlur={() => onHoverChange?.(false)}
          >
            {number}
          </button>
        ) : (
          <span className={`${styles.marker} ${markerInside ? styles.markerInside : ""}`} aria-hidden="true">
            {number}
          </span>
        ))}
    </div>
  );
}
