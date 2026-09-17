import Link from "next/link";
import { Container, Grid, GridBand } from "@/components/layout/grid";
import { Button } from "@/components/ui/button";
import { SecurityCard } from "./security-card";
import { DataPrivacyVisual } from "./visuals/data-privacy-visual";
import { IsoCertificationVisual } from "./visuals/iso-certification-visual";
import { RegionalHostingVisual } from "./visuals/regional-hosting-visual";

// Figma: Security, 415:4576 — 1440 × 930, 160px vertical padding.
// Both rows span columns 2–11. The approved header text boxes are 597/388px;
// the card row divides that same grid span into three 370px cards, 17px apart.
// Responsive inference: stack the header below lg; cards use 1/2/3 columns.
export function Security() {
  return (
    <section aria-labelledby="security-heading" data-slot="security" className="bg-black py-(--space-section-generous)">
      <Container>
        <Grid className="gap-y-(--space-section-content-gap) max-md:gap-y-(--space-visual-gap)">
          <GridBand className="gap-y-(--space-heading-gap)">
            <h2 id="security-heading" className="text-heading-h3 col-span-12 text-white lg:col-start-2 lg:col-end-8 lg:max-w-[597px]">
              Built to protect your data and meet your security standards.
            </h2>
            <div className="col-span-12 flex flex-col items-start gap-(--space-content-gap) lg:col-start-8 lg:col-end-12 lg:max-w-[388px] lg:self-end lg:justify-self-end">
              <p className="text-body-medium-regular pb-0.5 text-white/80">
                {"Customer data is never used to train Nettle's models. Deployed on-premise or in the cloud, according to each carrier's requirements. "}
                {/* No destination is supplied in Figma; follows existing CTA placeholders. */}
                <Link href="#" className="relative hidden text-white underline underline-offset-auto before:absolute before:-inset-y-3 before:inset-x-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:inline">
                  Security overview →
                </Link>
              </p>
              {/* Mobile follow-up: separate white action; keep desktop's inline link. */}
              <Button href="#" variant="light" className="md:hidden">
                Security overview
              </Button>
            </div>
          </GridBand>
          <ul className="col-span-12 grid grid-cols-1 gap-[17px] sm:grid-cols-2 lg:col-start-2 lg:col-end-12 lg:grid-cols-3" data-slot="security-cards">
            <SecurityCard id="security-iso-heading" title="ISO/IEC 27001" visual={<IsoCertificationVisual />} textureClassName="-scale-x-100">
              Independently audited controls for<br />security, availability, and confidentiality.
            </SecurityCard>
            <SecurityCard id="security-privacy-heading" title="Your data stays yours" visual={<DataPrivacyVisual />} textureClassName="rotate-180">
              Customer data remains private and<br />is never used to train AI models.
            </SecurityCard>
            <SecurityCard id="security-hosting-heading" title="Regional data hosting" visual={<RegionalHostingVisual />}>
              Sensitive data remains securely hosted<br />within approved geographic regions.
            </SecurityCard>
          </ul>
        </Grid>
      </Container>
    </section>
  );
}
