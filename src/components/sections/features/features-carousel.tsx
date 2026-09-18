"use client";

import { type ReactNode } from "react";
import { useCarousel } from "@/components/ui/use-carousel";
import { Container, Grid } from "@/components/layout/grid";
import { CarouselControls } from "@/components/ui/carousel-controls";
import carouselStyles from "@/components/layout/grid/carousel.module.css";

// The cards and their visual components remain server-rendered children.
export function FeaturesCarousel({ children }: { children: ReactNode }) {
  const { viewportRef, available, move } = useCarousel("[data-slot='feature-card']");

  return (
    <>
      <Container>
        <Grid>
          <div className="col-span-12 flex items-end justify-between gap-(--space-content-gap) text-left lg:col-start-2 lg:col-end-12">
            <h2 id="features-heading" className="text-heading-h3 max-w-[517px] text-balance text-black">
              The complete workspace for modern Loss Control.
            </h2>
            <CarouselControls available={available} trackId="features-track" label="features" onMove={move} />
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
