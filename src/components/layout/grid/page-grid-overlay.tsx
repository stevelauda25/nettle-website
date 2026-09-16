import { Container } from "./container";
import { GridOverlay } from "./grid-overlay";

type PageGridOverlayProps = {
  visible: boolean;
};

/**
 * Full-height, viewport-fixed column overlay for page previews.
 * Wraps <GridOverlay> in its own <Container>, which resolves to the same box
 * as every full-width section's Container, so columns still match content.
 */
export function PageGridOverlay({ visible }: PageGridOverlayProps) {
  if (!visible || process.env.NODE_ENV === "production") return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]">
      <Container className="h-full">
        <GridOverlay visible />
      </Container>
    </div>
  );
}
