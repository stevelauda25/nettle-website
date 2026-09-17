import { GridToggle, PageGridOverlay } from "@/components/layout/grid";
import { SiteHeader } from "@/components/layout/site-header";
import { Hero } from "@/components/sections/hero/hero";
import { KeyMetrics } from "@/components/sections/key-metrics/key-metrics";
import { VideoExplainer } from "@/components/sections/video-explainer/video-explainer";

export default async function Home({ searchParams }: PageProps<"/">) {
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
      <GridToggle pathname="/" active={gridOn} />
    </>
  );
}
