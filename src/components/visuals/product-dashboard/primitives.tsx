import Image from "next/image";
import type { ReactNode } from "react";
import type { BadgeTone } from "./types";

// Text sizes in the dashboard (8–24px) are illustration scale, not site typography.

export function DashboardIcon({ src, size }: { src: string; size: number }) {
  return <Image src={src} alt="" width={size} height={size} className="shrink-0" style={{ width: size, height: size }} />;
}

// Illustration-only badge colors. Tokens are used where Figma binds a variable;
// the raw values are unbound fills in Figma (see design-system review notes).
const badgeTone: Record<BadgeTone, string> = {
  critical: "bg-[#ffebeb] text-[#ff0000]",
  high: "bg-[#fef1eb] text-brand-500",
  visit: "bg-[#f0f0ff] text-[#6868a8]",
  review: "bg-warm-gray-100 text-warm-gray-800",
  neutral: "bg-warm-gray-50 text-warm-gray-800",
};

export function DashboardBadge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return (
    <span
      data-slot="badge"
      className={`inline-flex items-center justify-center rounded-sm px-1 py-[3px] text-[10px] leading-[1.1] ring-[0.5px] ring-black/15 ${badgeTone[tone]}`}
    >
      {children}
    </span>
  );
}

export function DashboardCheckbox() {
  return <span className="block size-[13px] rounded-[2px] border-[0.5px] border-black/15 bg-white" />;
}
