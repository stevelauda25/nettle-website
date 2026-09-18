import { BusinessLineCarousel } from "./business-line-carousel";
import Image from "next/image";
import { BusinessLineArtwork } from "./business-line-artwork";
import { businessLines } from "./data";
import styles from "./business-lines.module.css";

// Figma: "Built for every line of business" (409:3967), 1440 × 903.
// The carousel begins on grid column 2. Each 448px card is exactly four grid
// columns at the approved viewport and the track intentionally clips the third
// card at the right viewport edge.
export function BusinessLines() {
  return (
    <section
      aria-labelledby="business-lines-heading"
      data-slot="business-lines"
      className="overflow-hidden bg-white pt-(--space-section-adjoining) pb-(--space-section-major)"
    >
      <BusinessLineCarousel>
        {businessLines.map((line) => (
          <li key={line.id} data-slot="business-line-card" className={`${styles.card} relative isolate overflow-hidden rounded-lg bg-white`}>
            <Image src="/assets/images/features/card-texture.png" alt="" fill sizes="(min-width: 1440px) 448px, (min-width: 768px) 50vw, 100vw" className="pointer-events-none -z-10 -scale-x-100 object-cover opacity-5 mix-blend-hard-light" />
            <article aria-labelledby={`business-line-${line.id}`}>
              <BusinessLineArtwork line={line} />
              <div className="flex flex-col gap-(--space-related-gap) px-(--space-card-padding) pt-(--space-card-padding) pb-[23.2px]">
                <h3 id={`business-line-${line.id}`} className="text-heading-h6 text-balance text-warm-gray-950">{line.name}</h3>
                <p className="text-body-medium-regular text-warm-gray-900">{line.description}</p>
              </div>
            </article>
          </li>
        ))}
      </BusinessLineCarousel>
    </section>
  );
}
