import { GridToggle, PageGridOverlay } from "@/components/layout/grid";
import { SiteHeader } from "@/components/layout/site-header";
import { BusinessLines } from "@/components/sections/business-lines";
import { ChallengeToday } from "@/components/sections/challenge-today";
import { Features } from "@/components/sections/features";
import { Cta } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero/hero";
import { KeyMetrics } from "@/components/sections/key-metrics/key-metrics";
import { SolutionsByRole } from "@/components/sections/solutions-by-role";
import { Security } from "@/components/sections/security";
import { Testimonial } from "@/components/sections/testimonial";
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
        <ChallengeToday />
        <Features />
        <BusinessLines />
        <SolutionsByRole />
        <Testimonial />
        <Security />
        <Cta />
      </main>
      <Footer />
      <PageGridOverlay visible={gridOn} />
      <GridToggle pathname="/" active={gridOn} />
    </>
  );
}
