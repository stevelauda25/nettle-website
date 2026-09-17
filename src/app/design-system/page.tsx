import { DocsShell } from "./_components/docs-shell";
import { FoundationCard } from "./_components/foundation-card";

const foundations = [
  {
    title: "Border radius",
    description: "Corner hierarchy for controls, cards and imagery.",
    href: "/design-system/radius",
    icon: "/assets/icons/foundations/grid.svg",
  },
  {
    title: "Logo",
    description: "Colour treatments, master assets and brand naming rules.",
    href: "/design-system/logo",
    icon: "/assets/icons/foundations/typography.svg",
  },
  {
    title: "Imagery",
    description: "Pre-1900 industrial direction, treatment and provenance.",
    href: "/design-system/imagery",
    icon: "/assets/icons/foundations/color.svg",
  },
  {
    title: "Spacing",
    description: "Explore responsive spacing roles and usage rules.",
    href: "/design-system/spacing",
    icon: "/assets/icons/foundations/grid.svg",
  },
  {
    title: "Color",
    description: "Explore the color styles and usage guidance.",
    href: "/design-system/color",
    icon: "/assets/icons/foundations/color.svg",
  },
  {
    title: "Typography",
    description: "Explore the typography styles and usage guidelines.",
    href: "/design-system/typography",
    icon: "/assets/icons/foundations/typography.svg",
  },
  {
    title: "Grid",
    description: "Explore the layout grid and alignment rules.",
    href: "/design-system/grid",
    icon: "/assets/icons/foundations/grid.svg",
  },
] as const;

export default function DesignSystemHome() {
  return (
    <DocsShell>
      <header className="flex min-h-12 w-full flex-col gap-1 border-b border-border-subtle px-3 pb-6">
        <h1 className="text-base leading-6 font-medium tracking-[0] text-text-primary">Nettle Design System</h1>
        <p className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">
          Start with the core design decisions that shape every Nettle interface.
        </p>
      </header>

      <section aria-labelledby="foundations-heading" className="flex w-full flex-col gap-2.5">
        <div className="h-5 px-3">
          <h2 id="foundations-heading" className="text-sm leading-5 font-medium tracking-[0] text-text-primary">
            Foundations
          </h2>
        </div>

        <div className="grid w-full grid-cols-[repeat(3,220px)] gap-2.5">
          {foundations.map((foundation) => (
            <FoundationCard key={foundation.href} {...foundation} />
          ))}
        </div>
      </section>
    </DocsShell>
  );
}
