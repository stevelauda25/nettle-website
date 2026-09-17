"use client";

import { useRef, type ReactNode } from "react";
import { Container, Grid } from "@/components/layout/grid";
import carouselStyles from "@/components/layout/grid/carousel.module.css";
import styles from "./testimonial.module.css";

// Only keyboard navigation needs a client ref; content/artwork are server children.
export function TestimonialCarousel({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);

  function move(direction: -1 | 1) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const maximum = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    // Both approved slides occupy the full ten-column content band.
    viewport.scrollTo({ left: direction === 1 ? maximum : 0, behavior: "instant" });
  }

  return (
    <>
      <Container>
        <Grid>
          <div className="col-span-12 text-left lg:col-start-2 lg:col-end-12">
            <h2 id="testimonial-heading" className="text-heading-h3 max-w-[408px] text-balance text-black">Do what previously seemed impossible</h2>
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
