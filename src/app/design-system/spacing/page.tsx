import type { Metadata } from "next";
import { DocsShell } from "../_components/docs-shell";
import { OnThisPage, type OnThisPageItem } from "../_components/on-this-page";
import { responsiveSpacing, sectionSpacing, spacingAudit, spacingExceptions, spacingRules, spacingTokens } from "../_data/spacing";

export const metadata: Metadata = { title: "Spacing" };

const items: readonly OnThisPageItem[] = [
  { label: "Spacing scale", href: "#spacing-scale" },
  { label: "Section spacing", href: "#section-spacing" },
  { label: "Responsive Spacing System", href: "#responsive-spacing" },
  { label: "Audit and exceptions", href: "#spacing-audit" },
];

function endpoints(name: string) {
  const token = spacingTokens.find((item) => item.name === name)!;
  return `${token.min} → ${token.max}px`;
}

export default function SpacingPage() {
  return (
    <DocsShell pageTitle="Spacing" activePath="/design-system/spacing" breadcrumb={{ parent: "Foundations", current: "Spacing" }} detailRail={<OnThisPage items={items} />} responsive>
      <header className="flex flex-col gap-2 border-b border-border-subtle pb-6">
        <h1 className="text-lg font-medium text-text-primary">Responsive Spacing System</h1>
        <p className="text-sm leading-5 text-text-secondary">
          Balanced mobile spacing, preserving Nettle’s desktop endpoints. Shared interpolation:
          {" "}{responsiveSpacing.minViewport}–{responsiveSpacing.maxViewport}px at a {responsiveSpacing.defaultRootSize}px root.
          Bars below render the actual CSS tokens and resize with the viewport.
        </p>
      </header>

      <section id="spacing-scale" className="flex min-w-0 flex-col gap-4">
        <h2 className="text-base font-medium text-text-primary">Spacing scale</h2>
        <p className="text-sm leading-5 text-text-secondary">Min/max labels are default-root pixel equivalents. Fixed means viewport-independent, not immune to root text-size preferences.</p>
        {spacingTokens.map((token) => (
          <article key={token.name} className="min-w-0 rounded-card border border-border-subtle p-4">
            <h3 className="text-sm font-medium text-text-primary">{token.label}</h3>
            <code className="mt-1 block break-all text-xs text-text-secondary">{token.name}</code>
            <div className="my-3 max-w-full overflow-x-auto" aria-hidden="true">
              <div className="h-3 rounded-sm bg-background-accent" style={{ width: `var(${token.name})` }} />
            </div>
            <dl className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-secondary">
              <div><dt>Mobile minimum</dt><dd className="font-mono text-text-primary">{token.min}px</dd></div>
              <div><dt>Desktop maximum</dt><dd className="font-mono text-text-primary">{token.max}px</dd></div>
              <div><dt>Behavior</dt><dd className="text-text-primary">{token.scaling}</dd></div>
            </dl>
            <p className="mt-3 text-sm leading-5 text-text-secondary">{token.usage}</p>
            {token.aliasOf && <p className="mt-2 break-all text-xs text-text-tertiary">Alias of {token.aliasOf}</p>}
            <p className="mt-2 text-xs leading-4 text-text-tertiary">{token.provenance}</p>
          </article>
        ))}
      </section>

      <section id="section-spacing" className="flex flex-col gap-4">
        <h2 className="text-base font-medium text-text-primary">Section spacing</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm leading-5 text-text-secondary">
            <caption className="mb-3 text-left">Outer padding only; no extra section margins.</caption>
            <thead className="text-text-primary"><tr><th className="py-2 pr-4">Section</th><th className="py-2 pr-4">Top</th><th className="py-2">Bottom</th></tr></thead>
            <tbody>
              {sectionSpacing.map((section) => (
                <tr key={section.label} className="border-t border-border-subtle">
                  <th scope="row" className="py-2 pr-4 font-normal">{section.label}</th>
                  <td className="py-2 pr-4 whitespace-nowrap">{endpoints(section.top)}</td>
                  <td className="py-2">{section.bottom ? endpoints(section.bottom) : "Legal/artwork unchanged"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-5 text-text-secondary">Challenge inherits fluid page padding only. Video’s existing desktop animation overrides static padding; its track and pinning are unchanged.</p>
      </section>

      <section id="responsive-spacing" className="flex flex-col gap-3">
        <h2 className="text-base font-medium text-text-primary">Responsive Spacing System</h2>
        {spacingRules.map((rule) => <p key={rule} className="text-sm leading-5 text-text-secondary">{rule}</p>)}
        <p className="text-sm leading-5 text-text-secondary">
          Source: {responsiveSpacing.source} Directional reference:{" "}
          <a href={responsiveSpacing.referenceUrl} className="underline">Harvey</a>.
        </p>
      </section>

      <section id="spacing-audit" className="flex flex-col gap-3">
        <h2 className="text-base font-medium text-text-primary">Audit and intentional exceptions</h2>
        {spacingAudit.map((line) => <p key={line} className="text-sm leading-5 text-text-secondary">{line}</p>)}
        <h3 className="mt-3 text-sm font-medium text-text-primary">Preserved values</h3>
        {spacingExceptions.map((line) => <p key={line} className="text-sm leading-5 text-text-secondary">{line}</p>)}
        <h3 className="mt-3 text-sm font-medium text-text-primary">Manual review</h3>
        <p className="text-sm leading-5 text-text-secondary">
          Inspect page edges, card insets, Hero/video separation and footer density at 390px;
          continuity at 768px; content rhythm through existing layouts at 1024px and 1280px;
          desktop endpoints at 1440px. Resize continuously and check enlarged text.
          No automated browser QA is used.
        </p>
      </section>
    </DocsShell>
  );
}
