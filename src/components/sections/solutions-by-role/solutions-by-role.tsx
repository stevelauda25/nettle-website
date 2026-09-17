import Image from "next/image";
import { Container, Grid } from "@/components/layout/grid";
import { RoleCard } from "./role-card";
import { LossControlVisual } from "./visuals/loss-control-visual";
import { UnderwritingVisual } from "./visuals/underwriting-visual";

// Figma 415:4188, 1440 × 957. Cards occupy columns 2–6 and 7–11.
// No responsive frame is supplied: stack below lg and retain each artwork's
// composition with ScaledCanvas. The heading uses the same five-column width.
export function SolutionsByRole() {
  return (
    <section aria-labelledby="solutions-by-role-heading" data-slot="solutions-by-role" className="relative isolate bg-black py-(--space-section-standard)">
      <Image src="/assets/images/features/card-texture.png" alt="" fill sizes="100vw" className="pointer-events-none -z-10 object-cover opacity-[0.08]" aria-hidden="true" />
      <Container>
        <Grid className="gap-y-(--space-section-content-gap)">
          <div className="col-span-12 flex justify-center lg:col-span-10 lg:col-start-2">
            <h2 id="solutions-by-role-heading" className="text-heading-h3 text-center text-white lg:w-[calc((100%-var(--grid-gutter))/2)]">
              Built for the teams shaping better risk decisions.
            </h2>
          </div>
          <RoleCard id="loss-control-leaders-heading" title="For Loss Control Leaders" description="5x your team’s capacity, make smart decisions on which requests to prioritize, deliver outputs for clients and underwriters the same day" className="col-span-12 lg:col-span-5 lg:col-start-2">
            <LossControlVisual />
          </RoleCard>
          <RoleCard id="underwriting-leaders-heading" title="For Underwritting Leaders" description="Consistent risk data across the portfolio, faster decisions, and greater capacity to write premium with confidence." className="col-span-12 lg:col-span-5">
            <UnderwritingVisual />
          </RoleCard>
        </Grid>
      </Container>
    </section>
  );
}
