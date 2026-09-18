"use client";

import { type ReactNode } from "react";
import { useCarousel } from "@/components/ui/use-carousel";
import { Container, Grid } from "@/components/layout/grid";
import { CarouselControls } from "@/components/ui/carousel-controls";
import carouselStyles from "@/components/layout/grid/carousel.module.css";
import styles from "./business-lines.module.css";

// Button and keyboard scrolling need a client ref; cards/artwork remain server
// children. Touch/trackpad scrolling and snapping are native, with no autoplay.
export function BusinessLineCarousel({ children }: { children: ReactNode }) {
  const { viewportRef, available, move } = useCarousel("[data-slot='business-line-card']");

  return (
    <>
      <Container>
        <Grid>
          <div className="col-span-12 flex items-end justify-between gap-(--space-content-gap) text-left lg:col-start-2 lg:col-end-12">
            <h2 id="business-lines-heading" className="text-heading-h3 text-balance text-black">
              One workspace across
              <br className="hidden sm:block" />{" "}
              every line of business.
            </h2>
            <CarouselControls available={available} trackId="business-lines-track" label="business lines" onMove={move} />
          </div>
        </Grid>
      </Container>
      <div
        ref={viewportRef}
        id="business-lines-track"
        data-slot="business-lines-track"
        tabIndex={0}
        role="region"
        aria-label="Business lines"
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        className={`mt-(--space-section-content-gap) focus-visible:outline-2 focus-visible:outline-brand-500 ${carouselStyles.viewport} ${styles.layout} ${styles.viewport}`}
      >
        <ul className={carouselStyles.track}>{children}</ul>
      </div>
    </>
  );
}
