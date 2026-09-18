"use client";

import type { CarouselAvailability } from "./carousel-controller";
import { CarouselArrow } from "./carousel-arrow";

type CarouselControlsProps = {
  available: CarouselAvailability;
  trackId: string;
  label: string;
  onMove: (direction: -1 | 1) => void;
};

export function CarouselControls({ available, trackId, label, onMove }: CarouselControlsProps) {
  return (
    <div className="hidden shrink-0 items-center gap-(--space-related-gap) md:flex" data-slot="carousel-controls">
      <CarouselArrow direction="previous" aria-label={`Previous ${label}`} aria-controls={trackId} disabled={!available.previous} onClick={() => onMove(-1)} />
      <CarouselArrow direction="next" aria-label={`Next ${label}`} aria-controls={trackId} disabled={!available.next} onClick={() => onMove(1)} />
    </div>
  );
}
