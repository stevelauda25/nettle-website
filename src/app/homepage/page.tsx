import type { Metadata } from "next";
import Link from "next/link";
import { PageGridOverlay } from "@/components/layout/grid";
import { SiteHeader } from "@/components/layout/site-header";
import { Hero } from "@/components/sections/hero/hero";
import { KeyMetrics } from "@/components/sections/key-metrics/key-metrics";
import { VideoExplainer } from "@/components/sections/video-explainer/video-explainer";

export const metadata: Metadata = {
  title: "Homepage preview | Nettle",
  robots: { index: false },
};

export default async function HomepagePreview({ searchParams }: PageProps<"/homepage">) {
  const { grid } = await searchParams;
  const gridOn = grid === "true";

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <VideoExplainer />
        <KeyMetrics />
      </main>
      <PageGridOverlay visible={gridOn} />

      {/* The overlay is stripped from production builds, so the toggle is dev-only too. */}
      {process.env.NODE_ENV !== "production" && (
        <Link
          href={gridOn ? "/homepage" : "/homepage?grid=true"}
          scroll={false}
          role="switch"
          aria-checked={gridOn}
          className="fixed right-4 bottom-4 z-[70] flex items-center gap-2 rounded-full border border-black/10 bg-white/90 py-1 pr-1 pl-3 text-[12px] leading-none text-warm-gray-800 shadow-sm backdrop-blur-sm"
        >
          Grid
          <span
            aria-hidden="true"
            className={`relative h-4 w-7 rounded-full transition-colors ${gridOn ? "bg-brand-500" : "bg-black/10"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-3 rounded-full bg-white shadow-sm transition-transform ${gridOn ? "translate-x-3" : ""}`}
            />
          </span>
        </Link>
      )}
    </>
  );
}
