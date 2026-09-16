import { Button } from "@/components/ui/button";
import { Container, Grid } from "@/components/layout/grid";
import { BrandAccent } from "@/components/visuals/brand-accent";
import { ProductDashboard } from "@/components/visuals/product-dashboard";

// Figma: Hero (388:5722). The 180px top padding in Figma includes the 82px
// site header, which is rendered in flow above this section.
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="bg-white pt-24.5 pb-15">
      <Container>
        <BrandAccent variant="field-inspection" className="absolute top-2 left-0 hidden xl:block" />
        <BrandAccent variant="commercial-properties" className="absolute top-2 right-0 hidden xl:block" />

        <Grid>
          <div className="col-span-12 flex flex-col items-center gap-8 text-center lg:col-start-3 lg:col-end-11 xl:col-start-4 xl:col-end-10">
            <div className="flex flex-col gap-4">
              <h1 id="hero-heading" className="text-heading-h1 text-balance text-black">
                The AI Workspace for Loss Control
              </h1>
              <p className="text-body-medium-regular text-warm-gray-900">
                Turning Loss Control into a competitive edge.
              </p>
            </div>
            <Button href="#">Request a Demo</Button>
          </div>
        </Grid>

        <Grid className="mt-20">
          <div className="col-span-12 lg:col-start-2 lg:col-end-12">
            <ProductDashboard />
          </div>
        </Grid>
      </Container>
    </section>
  );
}
