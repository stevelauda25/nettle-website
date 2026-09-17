import Link from "next/link";
import type { ReactNode } from "react";

type RoleCardProps = {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function RoleCard({ id, title, description, children, className = "" }: RoleCardProps) {
  return (
    // Figma 415:4194/4208 uses an unbound #181515 fill. The 108px content
    // row and 81px footer preserve the approved 567px card at 564px wide.
    <article
      aria-labelledby={id}
      data-slot="role-card"
      className={`grid min-w-0 grid-rows-[minmax(108px,auto)_auto_minmax(81px,auto)] rounded-lg bg-[#181515] px-(--space-card-padding-spacious) pt-(--space-card-padding-spacious) outline outline-offset-[-1px] outline-white/5 ${className}`}
    >
      <div className="flex flex-col gap-(--space-related-gap) pb-(--space-component-gap)" data-slot="role-content">
        <h3 id={id} className="text-heading-h6 text-white">{title}</h3>
        <p className="text-body-medium-regular text-warm-gray-100">{description}</p>
      </div>
      {children}
      <div className="flex items-start pt-(--space-content-gap) pb-7">
        {/* No destination is supplied in Figma; matches the existing CTA convention. */}
        <Link href="#" aria-label={`Learn more: ${title}`} className="text-body-small-medium text-white underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          Learn more →
        </Link>
      </div>
    </article>
  );
}
