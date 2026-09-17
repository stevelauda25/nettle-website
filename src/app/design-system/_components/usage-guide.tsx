import type { ReactNode } from "react";
import { DocsShell } from "./docs-shell";
import { OnThisPage } from "./on-this-page";
import { ProvenanceCard } from "./provenance-card";

export type UsageSection = {
  id: string;
  title: string;
  description: string;
  rules: readonly string[];
};

// Route-private documentation structure; not a marketing-site primitive.
export function UsageGuide({ title, path, introduction, provenance, sections, children }: {
  title: string;
  path: string;
  introduction: string;
  provenance: string;
  sections: readonly UsageSection[];
  children: ReactNode;
}) {
  return (
    <DocsShell pageTitle={title} activePath={path} breadcrumb={{ parent: "Foundations", current: title }}
      detailRail={<OnThisPage items={[{ label: "Examples", href: "#examples" }, ...sections.map(({ id, title }) => ({ label: title, href: `#${id}` as const }))]} />}
      responsive smoothAnchorScroll>
      <header className="flex flex-col gap-2 border-b border-border-subtle pb-6">
        <h1 className="text-lg font-medium text-text-primary">{title}</h1>
        <p className="text-sm leading-6 text-text-secondary">{introduction}</p>
      </header>
      <ProvenanceCard>{provenance}</ProvenanceCard>
      <section id="examples" className="flex min-w-0 flex-col gap-4">
        <h2 className="text-base font-medium text-text-primary">Examples</h2>
        {children}
      </section>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="flex min-w-0 flex-col gap-3">
          <h2 className="text-base font-medium text-text-primary">{section.title}</h2>
          <p className="text-sm leading-6 text-text-secondary">{section.description}</p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-text-secondary">
            {section.rules.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </section>
      ))}
    </DocsShell>
  );
}
