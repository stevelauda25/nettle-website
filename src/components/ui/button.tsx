import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "light";
};

// Figma: 14px Medium label, 12px / 10px padding, 6px radius, 35px tall.
// body-small-medium's 1.4 line height with 8px vertical padding lands on the same 35px.
// CTA 415:4676 adds a reusable light treatment. Its detached label uses 110%
// line height and 10px vertical padding; existing primary consumers stay unchanged.
const variants = {
  primary: "bg-warm-gray-950 py-2 text-warm-gray-50 focus-visible:outline-warm-gray-950",
  light: "relative bg-white py-2.5 text-warm-gray-950 ring-1 ring-black/10 before:absolute before:-inset-y-1.5 before:inset-x-0 focus-visible:outline-white",
} as const;

export function Button({ href, children, className = "", variant = "primary" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md px-3 text-body-small-medium focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${className}`}
    >
      {variant === "light" ? <span className="leading-[1.1]">{children}</span> : children}
    </Link>
  );
}
