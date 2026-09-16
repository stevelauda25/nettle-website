import Link from "next/link";
import { FoundationIcon } from "./foundation-icon";

type FoundationCardProps = {
  title: string;
  description: string;
  href: string;
  icon: string;
};

export function FoundationCard({ title, description, href, icon }: FoundationCardProps) {
  return (
    <Link
      href={href}
      className="relative flex h-[184px] w-[220px] flex-col overflow-hidden rounded-card bg-background-subtle shadow-card hover:bg-background-secondary"
    >
      <div className="h-24 shrink-0 border-b-[0.5px] border-dashed border-border-default p-3">
        <FoundationIcon className="size-3.5 text-text-secondary" src={icon} />
      </div>
      <div className="flex h-[88px] shrink-0 flex-col gap-1 overflow-hidden p-3 text-sm leading-5 tracking-[0]">
        <h3 className="font-medium text-text-primary">{title}</h3>
        <p className="font-normal text-text-secondary">{description}</p>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] border-[0.5px] border-border-default" />
    </Link>
  );
}
