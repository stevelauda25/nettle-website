"use client";

import { useRef, type ReactNode } from "react";
import { Container, Grid } from "@/components/layout/grid";
import carouselStyles from "@/components/layout/grid/carousel.module.css";

// The cards and their visual components remain server-rendered children.
export function FeaturesCarousel({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);

  function move(direction: -1 | 1) {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const current = viewport.scrollLeft;
    const maximum = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const cards = Array.from(viewport.querySelectorAll("[data-slot='feature-card']"));
    const firstCardLeft = cards[0]?.getBoundingClientRect().left;
    if (firstCardLeft === undefined) return;
    const stops = [0, ...cards.map((card) =>
      Math.min(maximum, Math.max(0, card.getBoundingClientRect().left - firstCardLeft)),
    ), maximum];
    // Choose an actual card boundary, including when returning from a clipped
    // final scroll position or after a manual swipe between cards.
    const target = direction === 1
      ? stops.find((stop) => stop > current + 1) ?? maximum
      : stops.findLast((stop) => stop < current - 1) ?? 0;
    viewport.scrollTo({ left: target, behavior: "instant" });
  }

  return (
    <>
      <Container>
        <Grid>
          <div className="col-span-12 text-left lg:col-start-2 lg:col-end-12">
            <h2 id="features-heading" className="text-heading-h3 max-w-[517px] text-balance text-black">
              The complete workspace for modern Loss Control.
            </h2>
          </div>
        </Grid>
      </Container>
      <div
        ref={viewportRef}
        id="features-track"
        role="region"
        aria-label="Feature cards"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        className={`mt-(--space-section-content-gap) focus-visible:outline-2 focus-visible:outline-brand-500 ${carouselStyles.viewport}`}
      >
        <ul className={carouselStyles.track}>{children}</ul>
      </div>
    </>
  );
}
