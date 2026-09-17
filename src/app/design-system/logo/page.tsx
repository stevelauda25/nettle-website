import type { Metadata } from "next";
import Image from "next/image";
import { UsageGuide } from "../_components/usage-guide";
import { logoSections, logoTreatments } from "../_data/usage";
import { LogoSpecimen } from "./_components/logo-specimen";

export const metadata: Metadata = { title: "Logo" };

export default function LogoPage() {
  return (
    <UsageGuide title="Logo" path="/design-system/logo"
      introduction="Preserve the Nettle master lockup, proportional sizing and distinction between functional branding and decorative Footer artwork."
      provenance="Based on the user-supplied Colour usage / Logos guidance. These are newly composed vector examples—not the reference image. Original logo paths are preserved; colours use existing Nettle tokens. Exact variant colour codes, clear space and minimum sizes are not specified in the reference."
      sections={logoSections}>
      <div className="flex flex-col gap-3">
        {logoTreatments.map((treatment) => (
          <article key={treatment.name} className="overflow-hidden rounded-card border border-border-subtle">
            <LogoSpecimen dark={treatment.dark} coloured={treatment.coloured} transparent={treatment.transparent} />
            <div className="border-t border-border-subtle p-4">
              <h3 className="text-sm font-medium text-text-primary">{treatment.name}</h3>
              <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm leading-6 text-text-secondary">
                <dt>Background</dt><dd>{treatment.background}</dd>
                <dt>Symbol</dt><dd>{treatment.symbol}</dd>
                <dt>Wordmark</dt><dd>{treatment.wordmark}</dd>
              </dl>
              <p className="mt-3 text-xs leading-5 text-text-tertiary">{treatment.status}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="text-sm leading-6 text-text-secondary">
        Specimens use the exact paths from the{" "}
        <a href="/assets/logos/nettle.svg" className="text-text-primary underline">original SVG</a>,
        with proportional sizing and documentation-only colour application. The production master remains unchanged.
      </p>
      <figure className="overflow-hidden rounded-card border border-border-subtle">
        <Image src="/assets/images/footer/footer-visual.png" alt="Decorative industrial streetscape with a large outlined Nettle lockup" width={1440} height={562} sizes="(max-width: 767px) 100vw, 584px" unoptimized className="h-auto w-full" />
        <figcaption className="p-4 text-sm leading-6 text-text-secondary">Existing Footer composition, not an alternate logo master. Original 1440 × 562 PNG; displayed without re-encoding.</figcaption>
      </figure>
    </UsageGuide>
  );
}
