"use client";

import { useEffect, useState } from "react";
import { resolveAnchor, type ResolvedAnnotation } from "@/review/lib/annotation-positioning";
import type { AnnotationAnchor } from "@/review/types/review";

export type AnnotationEntry = { id: string; anchor: AnnotationAnchor };
const EMPTY_POSITIONS: Record<string, ResolvedAnnotation> = {};

function samePositions(a: Record<string, ResolvedAnnotation>, b: Record<string, ResolvedAnnotation>) {
  const keys = Object.keys(b);
  if (Object.keys(a).length !== keys.length) return false;
  return keys.every((key) => {
    const prev = a[key];
    const next = b[key];
    return (
      prev !== undefined &&
      prev.attached === next.attached &&
      Math.abs(prev.x - next.x) < 0.5 &&
      Math.abs(prev.y - next.y) < 0.5 &&
      Math.abs(prev.width - next.width) < 0.5 &&
      Math.abs(prev.height - next.height) < 0.5
    );
  });
}

/**
 * Resolves each anchor to document coordinates and keeps them fresh. The layer
 * is document-positioned, so plain scrolling needs no work; re-measuring on
 * scroll/resize/layout changes covers sticky elements, scroll-linked
 * transforms, late-loading images and fonts, and viewport changes.
 */
export function useAnnotationPositions(entries: AnnotationEntry[]) {
  const [positions, setPositions] = useState<Record<string, ResolvedAnnotation>>({});

  useEffect(() => {
    // Collapsed tools and empty comment lists have nothing to keep positioned.
    if (entries.length === 0) return;

    let frame = 0;
    let stopped = false;
    let interval: number | undefined;

    const measure = () => {
      frame = 0;
      const next: Record<string, ResolvedAnnotation> = {};
      for (const entry of entries) next[entry.id] = resolveAnchor(entry.anchor);
      setPositions((prev) => (samePositions(prev, next) ? prev : next));
    };
    const schedule = () => {
      if (!stopped && document.visibilityState === "visible" && !frame) {
        frame = requestAnimationFrame(measure);
      }
    };
    const onVisibilityChange = () => {
      window.clearInterval(interval);
      interval = undefined;
      if (document.visibilityState === "visible") {
        schedule();
        interval = window.setInterval(schedule, 1000);
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    onVisibilityChange();
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.fonts?.ready.then(schedule);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearInterval(interval);
    };
  }, [entries]);

  return entries.length === 0 ? EMPTY_POSITIONS : positions;
}
