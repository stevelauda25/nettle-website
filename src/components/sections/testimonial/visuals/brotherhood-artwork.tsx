import { ScaledCanvas } from "@/components/visuals/product-dashboard";
import { ArtworkLayer } from "./artwork-layer";

// Figma 415:4524: separate composition, sharing only the image-layer primitive.
export function BrotherhoodArtwork() {
  return (
    <ScaledCanvas width={1144} height={516} label="Brotherhood Mutual archival collage" className="rounded-none">
      <div data-slot="brotherhood-artwork">
        <ArtworkLayer asset="brotherhood-linework.svg" x={0} y={0} width={1655} height={921} />
        <div data-slot="brotherhood-accent" className="absolute" style={{ left: 110, top: 109.5, width: 117.5, height: 117, maskImage: "url(/assets/icons/testimonial/brotherhood-accent-mask.svg)", maskSize: "100% 100%" }}>
          <div className="absolute origin-top-left" style={{ width: 295, height: 442.5, transform: "matrix(0,1,-1,0,198.501,-74.5)" }}>
            <ArtworkLayer asset="engraved-texture.png" x={0} y={0} width={295} height={442.5} />
            {/* Approved unbound monochrome photo overlay. */}
            <div className="absolute inset-0 bg-[#979797] mix-blend-color" />
          </div>
        </div>
        <ArtworkLayer asset="brotherhood-archive.png" x={457} y={61} width={618} height={736} style={{ maskImage: "url(/assets/icons/testimonial/brotherhood-mask-right.svg)", maskPosition: "386.5px 165.5px", maskSize: "120px 277.5px", maskRepeat: "no-repeat" }} />
        <ArtworkLayer asset="brotherhood-archive.png" x={457} y={61} width={618} height={736} style={{ maskImage: "url(/assets/icons/testimonial/brotherhood-mask-top.svg)", maskPosition: "-13.5px 48.5px", maskSize: "400px 117px", maskRepeat: "no-repeat" }} />
      </div>
    </ScaledCanvas>
  );
}
