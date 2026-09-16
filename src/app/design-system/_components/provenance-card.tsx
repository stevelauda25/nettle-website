import type { ReactNode } from "react";

type ProvenanceCardProps = {
  children: ReactNode;
  height?: 88 | 108;
};

export function ProvenanceCard({ children, height = 108 }: ProvenanceCardProps) {
  return (
    <section
      aria-labelledby="provenance-heading"
      className="relative flex w-full flex-col gap-1 overflow-hidden rounded-card bg-background-subtle p-3 shadow-card"
      style={{ minHeight: height }}
    >
      <h2 id="provenance-heading" className="h-5 shrink-0 text-sm leading-5 font-medium tracking-[0] text-text-primary">
        Provenance
      </h2>
      <div className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">{children}</div>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] border-[0.5px] border-border-default" />
    </section>
  );
}
