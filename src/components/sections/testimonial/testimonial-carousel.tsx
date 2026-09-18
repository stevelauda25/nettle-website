"use client";

import { type ReactNode } from "react";
import { useCarousel } from "@/components/ui/use-carousel";
import { Container, Grid } from "@/components/layout/grid";
import { CarouselControls } from "@/components/ui/carousel-controls";
import carouselStyles from "@/components/layout/grid/carousel.module.css";
import styles from "./testimonial.module.css";

// Button and keyboard navigation need a client ref; content/artwork are server children.
export function TestimonialCarousel({ children }: { children: ReactNode }) {
  const { viewportRef, available, move } = useCarousel("[data-slot='testimonial-card']");

  return (
    <>
      <Container>
        <Grid>
          <div className="col-span-12 flex items-end justify-between gap-(--space-content-gap) text-left lg:col-start-2 lg:col-end-12">
            <h2 id="testimonial-heading" className="text-heading-h3 max-w-[408px] text-balance text-black">Do what previously seemed impossible</h2>
            <CarouselControls available={available} trackId="testimonial-track" label="testimonials" onMove={move} />
          </div>
        </Grid>
      </Container>
      <div ref={viewportRef} id="testimonial-track" data-slot="testimonial-track" role="region" aria-label="Customer testimonials" aria-roledescription="carousel" tabIndex={0} className={`mt-(--space-section-content-gap) focus-visible:outline-2 focus-visible:outline-black ${carouselStyles.viewport} ${styles.viewport}`} onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
        <ul className={carouselStyles.track}>{children}</ul>
      </div>
    </>
  );
}
