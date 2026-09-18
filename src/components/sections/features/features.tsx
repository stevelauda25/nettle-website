import Image from "next/image";
import { ScaledCanvas } from "@/components/visuals/product-dashboard";
import { features, type Feature } from "./data";
import { FeaturesCarousel } from "./features-carousel";
import styles from "./features.module.css";
import { CoverageVisual, PreventionVisual, PrioritisationVisual, ReportingVisual } from "./visuals";

const visuals = {
  prioritisation: PrioritisationVisual,
  reporting: ReportingVisual,
  coverage: CoverageVisual,
  prevention: PreventionVisual,
};

function FeatureCard({ feature }: { feature: Feature }) {
  const Visual = visuals[feature.visual];
  return (
    <li
      data-slot="feature-card"
      className={`relative isolate flex w-[min(448px,var(--carousel-single-card-width))] shrink-0 flex-col overflow-hidden rounded-lg bg-white ${styles.card}`}
    >
      <Image
        src="/assets/images/features/card-texture.png"
        alt=""
        fill
        sizes="448px"
        className="pointer-events-none -scale-x-100 object-cover opacity-10 mix-blend-hard-light"
        aria-hidden="true"
      />

      <div className={`relative z-10 flex flex-col p-(--space-card-padding) ${feature.visual === "prioritisation" ? "min-h-[154px] gap-2.5" : "min-h-[156px] gap-(--space-related-gap)"}`}>
        <h3 className="text-heading-h6 text-balance text-warm-gray-950">{feature.title}</h3>
        <p className="text-body-medium-regular text-warm-gray-900">{feature.description}</p>
      </div>

      <div
        data-slot="feature-visual"
        className="relative z-10 mt-auto w-[calc(100%-32px)] self-end"
        aria-hidden="true"
      >
        <ScaledCanvas width={416} height={feature.visual === "prevention" ? 346 : feature.visualHeight} label={`${feature.title} product preview`} className="overflow-visible rounded-none">
          <div className="w-[416px]" style={{ height: feature.visualHeight }}><Visual /></div>
        </ScaledCanvas>
      </div>
    </li>
  );
}

// Figma: Features (409:3712), 1440 × 892. The card rail intentionally
// continues beyond the grid-aligned viewport, matching the approved carousel
// composition. Button and keyboard scrolling require client-side code.
export function Features() {
  return (
    <section aria-labelledby="features-heading" data-slot="features" className="overflow-hidden bg-white pt-(--space-section-major) pb-(--space-section-adjoining)">
      <FeaturesCarousel>
        {features.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </FeaturesCarousel>
    </section>
  );
}
