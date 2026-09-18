import { BusinessLineArtwork } from "@/components/sections/business-lines/business-line-artwork";
import { businessLines } from "@/components/sections/business-lines/data";
import carouselStyles from "@/components/layout/grid/carousel.module.css";
import styles from "@/components/sections/business-lines/business-lines.module.css";
import stage from "../../stage/stage.module.css";

/**
 * One Business Lines key visual, alone. DEV ONLY. Server component.
 *
 * Renders the production artwork component for the visual a Concept names,
 * nothing else: no heading, carousel, card chrome, texture or copy. The
 * wrapper carries the production carousel and card-width classes purely so
 * `--business-card-width` resolves exactly as it does on the site, which keeps
 * the artwork at its real responsive size at every viewport. Nothing here is
 * a copy of the artwork or of its sizing rules.
 */
export function Visual({ visual }: { visual: string }) {
  const line = businessLines.find((item) => item.visual === visual);
  if (!line) return null;
  return (
    <div className={`${carouselStyles.viewport} ${styles.layout}`} data-slot="business-line-focus">
      <div
        data-slot="business-line-subject"
        className={stage.subject}
        style={{ width: "var(--business-card-width)", marginInline: "auto" }}
      >
        <BusinessLineArtwork line={line} />
      </div>
    </div>
  );
}
