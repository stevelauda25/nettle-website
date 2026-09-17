import Link from "next/link";
import { Container, Grid } from "@/components/layout/grid";
import { footerLegalLinks, footerLinkGroups } from "./data";
import { FooterVisual } from "./footer-visual";

const linkClassName = "relative before:absolute before:-inset-y-2 before:inset-x-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-warm-gray-950";

// Figma Footer 415:4735: 120px top padding, 64px before the legal bar.
// Navigation anchors follow grid columns 7, 9 and 11 at 1440px.
// Mobile follow-up: Products/Solutions share a row; Company follows below.
// Keep three navigation columns from sm and the existing desktop grid anchors.
export function Footer() {
  return (
    <footer aria-label="Nettle" data-slot="footer" className="bg-warm-gray-100 pt-(--space-section-standard)">
      <Container>
        <Grid className="gap-y-(--space-content-block-gap)">
          <p className="col-span-12 text-body-medium-medium text-warm-gray-950 lg:col-span-3">
            The AI workspace for Loss Control.
          </p>
          <nav
            aria-label="Footer"
            className="col-span-12 grid grid-cols-2 gap-x-[var(--grid-gutter)] gap-y-(--space-content-block-gap) max-sm:gap-y-(--space-major-content-gap) sm:grid-cols-3 lg:col-start-7 lg:col-end-13"
          >
            {footerLinkGroups.map((group) => (
              <div key={group.id} data-slot={`footer-${group.id}`} className="min-w-0">
                <h2 id={`footer-${group.id}-heading`} className="text-body-medium-medium text-warm-gray-900">
                  {group.title}
                </h2>
                <ul aria-labelledby={`footer-${group.id}-heading`} className="mt-(--space-component-gap) flex flex-col gap-6 text-body-medium-regular text-warm-gray-800">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={linkClassName}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </Grid>
      </Container>

      {/* Detached legal text: Body/Small base, 120% leading, zero tracking.
          Keep this exception local; do not alter the shared text style. */}
      <div data-slot="footer-legal" className="mt-(--space-major-content-gap) border-b border-black/10 py-6 text-body-small-regular leading-[1.2] tracking-normal text-warm-gray-800">
        <Container>
          <Grid className="items-center gap-y-(--space-component-gap)">
            <nav aria-label="Legal" className="col-span-12 sm:col-span-8">
              <ul className="flex flex-wrap gap-4">
                {footerLegalLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={`${linkClassName} underline [text-underline-position:from-font]`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="col-span-12 sm:col-span-4 sm:text-right">© Nettle Limited 2026</p>
          </Grid>
        </Container>
      </div>
      <FooterVisual />
    </footer>
  );
}
