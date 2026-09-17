import Image from "next/image";
import { Container, Grid } from "@/components/layout/grid";
import { Button } from "@/components/ui/button";
import { CtaArtwork } from "./cta-artwork";
import { CtaMobileArtwork } from "./cta-mobile-artwork";
import styles from "./cta.module.css";

// Figma CTA 415:4669: 1440 × 591; 32px outer padding, 1376 × 527 panel.
// Follow-up spacing approval: section top padding is now 160px; bottom stays 32px.
// Six centered grid columns give the approved 680px content width at 1440px.
// Mobile card 440:4680 keeps the height with a distinct corner composition.
export function Cta() {
  return (
    <section aria-labelledby="cta-heading" data-slot="cta" className="bg-warm-gray-100 pt-(--space-section-generous) pb-(--space-section-flush)">
      <Container>
        <Grid className="relative isolate min-h-[527px] overflow-hidden rounded-md bg-brand-600 ring-1 ring-black/10">
          <div aria-hidden="true" className={`${styles.texture} pointer-events-none absolute inset-0 -z-10`}>
            <Image src="/assets/images/features/card-texture.png" alt="" fill sizes="(max-width: 767px) 1376px, (min-width: 1440px) 1376px, 100vw" className="object-cover opacity-25" />
          </div>
          <CtaArtwork />
          <CtaMobileArtwork />
          <div data-slot="cta-content" className={`${styles.content} relative col-start-2 col-end-12 flex flex-col items-center gap-(--space-content-gap) self-center py-(--space-major-content-gap) text-center lg:col-start-3 lg:col-end-11 xl:col-start-4 xl:col-end-10`}>
            <h2 id="cta-heading" className={`${styles.heading} text-heading-h3 w-full text-white`}>
              The future of loss control is here.
            </h2>
            <Button href="#" variant="light">See What’s Possible Today</Button>
          </div>
        </Grid>
      </Container>
    </section>
  );
}
