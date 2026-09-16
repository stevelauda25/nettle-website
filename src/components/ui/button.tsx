import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

// Figma: 14px Medium label, 12px / 10px padding, 6px radius, 35px tall.
// body-small-medium's 1.4 line height with 8px vertical padding lands on the same 35px.
export function Button({ href, children, className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-warm-gray-950 px-3 py-2 text-body-small-medium text-warm-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-gray-950 ${className}`}
    >
      {children}
    </Link>
  );
}
