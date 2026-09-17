"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { REVIEW_UI_ATTRIBUTE } from "@/review/lib/annotation-positioning";
import type { DocRect } from "@/review/types/review";
import styles from "./review.module.css";

/**
 * Zero-size layer at the document origin. Children are positioned in document
 * coordinates, so annotations scroll naturally with the page content.
 */
export function AnnotationLayer({ children }: { children: ReactNode }) {
  return (
    <div {...{ [REVIEW_UI_ATTRIBUTE]: "" }} className={`${styles.ui} ${styles.layer}`}>
      {children}
    </div>
  );
}

const POPOVER_WIDTH = 320;
const GAP = 16;
const MARGIN = 12;
// Keeps cards clear of the floating toolbar.
const BOTTOM_CLEARANCE = 72;

/**
 * Card placed beside an annotation (right, else left, else inside/below),
 * kept within the visible viewport when it renders. It is document-positioned,
 * so afterwards it scrolls with its annotation.
 */
export function AnnotationPopover({
  rect,
  rightInset = 0,
  children,
}: {
  rect: DocRect;
  /** Width covered by fixed UI on the right (the comments sidebar). */
  rightInset?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  // Viewport at open time; later re-renders must not make the card chase the scroll position.
  const [view] = useState(() => ({ top: window.scrollY, height: window.innerHeight }));

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const viewLeft = window.scrollX + MARGIN;
  const clientWidth = document.documentElement.clientWidth;
  // Ignore the inset when the sidebar covers (almost) the whole viewport, as on phones.
  const inset = clientWidth - rightInset >= POPOVER_WIDTH + 2 * MARGIN ? rightInset : 0;
  const viewRight = window.scrollX + clientWidth - inset - MARGIN;
  const width = Math.min(POPOVER_WIDTH, viewRight - viewLeft);

  let left = rect.x + rect.width + GAP;
  let top = rect.y;

  if (left + width > viewRight) left = rect.x - width - GAP;
  if (left < viewLeft) {
    left = Math.min(Math.max(rect.x + rect.width - width - GAP, viewLeft), viewRight - width);
    // Large areas: open inside the top of the area instead of far below it.
    top = rect.height > 240 ? rect.y + GAP + 8 : rect.y + rect.height + GAP;
  }

  const viewBottom = view.top + view.height - BOTTOM_CLEARANCE;
  if (top + height > viewBottom) top = viewBottom - height;
  top = Math.max(top, view.top + MARGIN);

  return (
    <div ref={ref} className={styles.popover} style={{ left, top, width }}>
      {children}
    </div>
  );
}
