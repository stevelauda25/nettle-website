import Link from "next/link";
import type { MouseEventHandler } from "react";
import { IconMask } from "./icon-mask";

type NavigationItemProps = {
  label: string;
  href?: string;
  icon?: string;
  trailingIcon?: string;
  active?: boolean;
  nested?: boolean;
  expanded?: boolean;
  controls?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function NavigationItem({
  label,
  href,
  icon,
  trailingIcon,
  active = false,
  nested = false,
  expanded,
  controls,
  onClick,
}: NavigationItemProps) {
  const className = [
    "flex h-8 w-full items-center rounded-navigation py-1.5 text-xs leading-[18px] font-normal tracking-[0] hover:bg-background-secondary hover:text-text-primary",
    nested ? "px-[34px]" : "gap-2.5 px-2.5",
    active ? "bg-background-secondary text-text-primary" : "text-text-secondary",
  ].join(" ");

  const content = (
    <>
      {icon ? <IconMask src={icon} /> : null}
      <span className="min-w-0 flex-1 text-left">{label}</span>
      {trailingIcon ? <IconMask src={trailingIcon} flipped={expanded} /> : null}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={className} aria-expanded={expanded} aria-controls={controls} onClick={onClick}>
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} className={className} aria-current={active ? "page" : undefined}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
