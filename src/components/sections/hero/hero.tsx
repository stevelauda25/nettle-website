import { Button } from "@/components/ui/button";
import { Container, Grid } from "@/components/layout/grid";
import { BrandAccent } from "@/components/visuals/brand-accent";
import { ProductDashboard } from "@/components/visuals/product-dashboard";

// Figma: desktop Hero (388:5722); mobile composition (440:3510).
// The 180px top padding in desktop Figma includes the 82px
// site header, which is rendered in flow above this section.
// Mobile: header + Hero fill the first viewport, not 100vh plus the header.
// The current mobile header is ~96px (44px announcement + ~52px navbar).
// Accounting for its 6rem height reduces excess space above the content.
// Min-height allows enlarged text to grow; retain symmetric inner padding.
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="flex min-h-[calc(100vh-6rem)] items-center overflow-x-clip bg-white py-(--space-section-opening-end) md:block md:min-h-0 md:overflow-visible md:pt-(--space-section-opening-start)">
      <Container>
        <BrandAccent variant="field-inspection" className="absolute top-2 left-0 hidden xl:block" />
        <BrandAccent variant="commercial-properties" className="absolute top-2 right-0 hidden xl:block" />

        <Grid>
          <div className="col-span-12 flex flex-col items-center gap-(--space-content-gap) text-center lg:col-start-3 lg:col-end-11 xl:col-start-4 xl:col-end-10">
            <div className="flex flex-col gap-(--space-heading-gap)">
              <h1 id="hero-heading" className="text-heading-h1 text-balance text-black">
                The AI Workspace<br className="md:hidden" />{" "}for Loss Control
              </h1>
              {/* Hero is explicitly excluded from the smaller mobile type scale. */}
              <p className="text-body-medium-regular text-warm-gray-900 [--type-size-body-medium:1rem]">
                Turning Loss Control into a competitive edge.
              </p>
            </div>
            <Button href="#">Request a Demo</Button>
          </div>
        </Grid>

        <Grid className="mt-(--space-visual-gap)">
          {/* Mobile Figma keeps the dashboard at 640×392 rather than shrinking
              it to phone width. Anchor its left edge to the shared grid and
              crop only at the viewport edge; desktop retains its grid span. */}
          <div data-slot="hero-dashboard" className="col-span-12 w-[640px] min-w-full md:w-auto md:min-w-0 lg:col-start-2 lg:col-end-12">
            <ProductDashboard />
          </div>
        </Grid>
      </Container>
    </section>
  );
}
