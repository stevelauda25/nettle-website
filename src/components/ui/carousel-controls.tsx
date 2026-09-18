"use client";

import { useEffect, useState, type RefObject } from "react";
import { CarouselArrow } from "./carousel-arrow";

type CarouselControlsProps = {
  viewportRef: RefObject<HTMLDivElement | null>;
  trackId: string;
  label: string;
  onMove: (direction: -1 | 1) => void;
};

export function CarouselControls({ viewportRef, trackId, label, onMove }: CarouselControlsProps) {
  const [available, setAvailable] = useState({ previous: false, next: false });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    function update() {
      if (!viewport) return;
      const maximum = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const previous = viewport.scrollLeft > 1;
      const next = viewport.scrollLeft < maximum - 1;
      setAvailable((current) => current.previous === previous && current.next === next
        ? current
        : { previous, next });
    }

    // Native swipes, keyboard navigation and responsive card sizes all update the controls.
    viewport.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild);
    return () => {
      viewport.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [viewportRef]);

  return (
    <div className="hidden shrink-0 items-center gap-(--space-related-gap) md:flex" data-slot="carousel-controls">
      <CarouselArrow direction="previous" aria-label={`Previous ${label}`} aria-controls={trackId} disabled={!available.previous} onClick={() => onMove(-1)} />
      <CarouselArrow direction="next" aria-label={`Next ${label}`} aria-controls={trackId} disabled={!available.next} onClick={() => onMove(1)} />
    </div>
  );
}
