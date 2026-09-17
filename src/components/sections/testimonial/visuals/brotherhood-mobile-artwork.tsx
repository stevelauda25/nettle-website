import { ScaledCanvas } from "@/components/visuals/product-dashboard";
import { ArtworkLayer } from "./artwork-layer";

// Figma 440:4549: only the linework and triangular engraving appear on mobile.
export function BrotherhoodMobileArtwork() {
  return (
    <ScaledCanvas width={340} height={201} label="Brotherhood Mutual mobile archival collage" className="rounded-none">
      <div data-slot="brotherhood-mobile-artwork">
        <ArtworkLayer asset="brotherhood-mobile-linework.svg" x={-74} y={-26.707} width={414} height={227.707} />
        <div data-slot="brotherhood-mobile-accent" className="absolute" style={{ left: 36, top: 83.5, width: 117.5, height: 117, maskImage: "url(/assets/icons/testimonial/brotherhood-accent-mask.svg)", maskSize: "100% 100%" }}>
          <div className="absolute origin-top-left" style={{ width: 295, height: 442.5, transform: "matrix(0,1,-1,0,198.501,-74.5)" }}>
            <ArtworkLayer asset="engraved-texture.png" x={0} y={0} width={295} height={442.5} />
            {/* Same approved unbound monochrome overlay as the desktop artwork. */}
            <div className="absolute inset-0 bg-[#979797] mix-blend-color" />
          </div>
        </div>
      </div>
    </ScaledCanvas>
  );
}
