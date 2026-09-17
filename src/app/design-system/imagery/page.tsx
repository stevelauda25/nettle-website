import type { Metadata } from "next";
import Image from "next/image";
import { UsageGuide } from "../_components/usage-guide";
import { imagerySections } from "../_data/usage";

export const metadata: Metadata = { title: "Imagery" };

export default function ImageryPage() {
  return (
    <UsageGuide title="Imagery" path="/design-system/imagery"
      introduction="Pre-1900 industrial subject matter, interpreted through Nettle’s engraved, halftone and geometric visual language. Keep historical provenance distinct from visual treatment."
      provenance="Pre-1900 direction supplied by the user. Treatment examples come from existing approved site assets; historical dates and archival attribution are not established by those exports. This documentation does not replace or reclassify existing imagery."
      sections={imagerySections}>
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <figure className="overflow-hidden rounded-card border border-border-subtle">
          <Image src="/assets/images/business-lines/property-riso.png" alt="Engraved-style factory waterfront and a surveyor using an optical instrument" width={1149} height={1368} sizes="(max-width: 639px) 100vw, 284px" unoptimized className="h-auto w-full" />
          <figcaption className="p-4 text-sm leading-6 text-text-secondary">Subject/treatment reference: industrial structure, inspection and fine linework. Source date is unverified; do not label it an archival pre-1900 image.</figcaption>
        </figure>
        <figure className="overflow-hidden rounded-card border border-border-subtle">
          <Image src="/assets/images/hero/riso-surveyor.png" alt="Teal halftone image of a person working with electronic equipment" width={820} height={1024} sizes="(max-width: 639px) 100vw, 284px" unoptimized className="h-auto w-full" />
          <figcaption className="p-4 text-sm leading-6 text-text-secondary">Treatment only: limited ink and paper texture. Electronic equipment makes this unsuitable as a pre-1900 subject reference. Existing Hero remains unchanged.</figcaption>
        </figure>
      </div>
      <p className="text-xs leading-5 text-text-tertiary">Documentation shows original exports without image re-encoding so line and halftone detail remain inspectable. Native sizes: 1149 × 1368 and 820 × 1024. No newly sourced or generated assets.</p>
    </UsageGuide>
  );
}
