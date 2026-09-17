import type { Metadata } from "next";
import { UsageGuide } from "../_components/usage-guide";
import { radiusExamples, radiusSections } from "../_data/usage";

export const metadata: Metadata = { title: "Border radius" };

export default function RadiusPage() {
  return (
    <UsageGuide title="Border radius" path="/design-system/radius"
      introduction="A restrained corner hierarchy for controls, cards, media and technical artwork. Use the existing component treatment, not a new radius scale."
      provenance="Audited from the current homepage components and installed Tailwind theme. These are existing implementation values, not newly inferred Figma variables. Marketing components and tokens are unchanged."
      sections={radiusSections}>
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        {radiusExamples.map((item) => (
          <article key={item.utility} className="min-w-0 rounded-card border border-border-subtle p-4">
            <div aria-hidden="true" className={`${item.utility} mb-4 size-16 border border-brand-500 bg-brand-50`} />
            <h3 className="text-sm font-medium text-text-primary">{item.label} · {item.value}</h3>
            <code className="mt-1 block text-xs text-text-secondary">{item.utility}</code>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{item.usage}</p>
          </article>
        ))}
      </div>
      <p className="text-xs leading-5 text-text-tertiary">Samples render the actual existing utilities. Pixel equivalents assume a 16px root; the radius is not viewport-fluid.</p>
    </UsageGuide>
  );
}
