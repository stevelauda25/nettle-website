import Image from "next/image";
import Link from "next/link";

export function DocsBrand() {
  return (
    <div className="col-start-1 row-start-1 flex h-16 items-center justify-between gap-3 px-5 py-4 shadow-[inset_-1px_0_0_var(--color-border-default),inset_0_-1px_0_var(--color-border-default)]">
      <Link href="/design-system" className="flex h-8 min-w-0 items-center gap-2 pl-2.5">
        {/* The logo asset is a 143×17 frame; the wordmark itself is 79px wide, so crop to it. */}
        <span className="relative block h-3.5 w-[65px] shrink-0 overflow-hidden">
          <Image src="/assets/logos/nettle.svg" alt="Nettle" width={118} height={14} className="absolute top-0 left-0 h-3.5 max-w-none" />
        </span>
        <span className="whitespace-nowrap text-xs leading-[18px] font-normal tracking-[0] text-text-secondary">
          Design System
        </span>
      </Link>

      <code className="inline-flex shrink-0 items-center rounded-[6px] bg-background-secondary px-1.5 py-0.5 font-mono text-xs leading-[18px] font-medium tracking-[0] text-text-secondary">
        draft
      </code>
    </div>
  );
}
