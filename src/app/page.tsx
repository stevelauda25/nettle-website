import { PageGridOverlay } from "@/components/layout/grid";
import { SiteHeader } from "@/components/layout/site-header";
import { Hero } from "@/components/sections/hero/hero";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { grid } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
      </main>
      <PageGridOverlay visible={grid === "true"} />
    </>
  );
}
