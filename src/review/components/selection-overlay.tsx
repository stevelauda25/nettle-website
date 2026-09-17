"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { REVIEW_UI_ATTRIBUTE } from "@/review/lib/annotation-positioning";
import type { DocRect } from "@/review/types/review";
import styles from "./review.module.css";

type DragState = { startX: number; startY: number; clientX: number; clientY: number };

// A click without a drag still creates a small area around the point.
const MIN_DRAG = 6;
const CLICK_AREA = 40;

function dragRect(drag: DragState): DocRect {
  const x = drag.clientX + window.scrollX;
  const y = drag.clientY + window.scrollY;
  return {
    x: Math.min(drag.startX, x),
    y: Math.min(drag.startY, y),
    width: Math.abs(x - drag.startX),
    height: Math.abs(y - drag.startY),
  };
}

type SelectionOverlayProps = {
  onDrag: (rect: DocRect | null) => void;
  onSelect: (rect: DocRect) => void;
};

/** Comment Mode capture layer: click and drag to draw an area. */
export function SelectionOverlay({ onDrag, onSelect }: SelectionOverlayProps) {
  const drag = useRef<DragState | null>(null);

  useEffect(() => {
    // Keep the rectangle attached to the content when the page scrolls mid-drag.
    const handleScroll = () => {
      if (drag.current) onDrag(dragRect(drag.current));
    };
    // Capture phase so Escape cancels the drag before the global review shortcuts see it.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !drag.current) return;
      event.preventDefault();
      drag.current = null;
      onDrag(null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [onDrag]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      startX: event.clientX + window.scrollX,
      startY: event.clientY + window.scrollY,
      clientX: event.clientX,
      clientY: event.clientY,
    };
    onDrag(dragRect(drag.current));
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    drag.current = { ...drag.current, clientX: event.clientX, clientY: event.clientY };
    onDrag(dragRect(drag.current));
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    drag.current = { ...drag.current, clientX: event.clientX, clientY: event.clientY };
    let rect = dragRect(drag.current);
    drag.current = null;
    onDrag(null);

    if (rect.width < MIN_DRAG && rect.height < MIN_DRAG) {
      rect = {
        x: Math.max(rect.x - CLICK_AREA / 2, 0),
        y: Math.max(rect.y - CLICK_AREA / 2, 0),
        width: CLICK_AREA,
        height: CLICK_AREA,
      };
    }
    onSelect(rect);
  }

  function handlePointerCancel() {
    drag.current = null;
    onDrag(null);
  }

  return (
    <div {...{ [REVIEW_UI_ATTRIBUTE]: "" }} className={styles.ui}>
      <div
        className={styles.overlay}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      />
      <p className={styles.hint} role="status">
        Drag to select an area · <kbd>Esc</kbd> to exit
      </p>
    </div>
  );
}
