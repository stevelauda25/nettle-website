import { ScaledCanvas } from "@/components/visuals/product-dashboard";
import { ArtworkLayer } from "./artwork-layer";

// Figma 415:4236: original artwork coordinates, masks, and layer order.
export function AllianzArtwork() {
  return (
    <ScaledCanvas width={1144} height={516} label="Allianz archival engineering collage" className="rounded-none">
      <div data-slot="allianz-artwork">
        <ArtworkLayer asset="allianz-linework.svg" x={-3} y={-142.91} width={1289.41} height={682.7} />
        <ArtworkLayer asset="allianz-archive.png" x={-20} y={-109} width={1033} height={775} style={{ maskImage: "url(/assets/icons/testimonial/allianz-mask-lower.svg)", maskPosition: "850.285px 288.551px", maskSize: "154.352px 198.449px", maskRepeat: "no-repeat" }} />
        <ArtworkLayer asset="allianz-archive.png" x={608} y={-35} width={460} height={345} style={{ maskImage: "url(/assets/icons/testimonial/allianz-mask-upper.svg)", maskPosition: "80.367px 21px", maskSize: "143.734px 193.957px", maskRepeat: "no-repeat" }} />
        <div data-slot="allianz-accent" className="absolute" style={{ left: 256, top: 33, width: 78, height: 78, maskImage: "url(/assets/icons/testimonial/allianz-accent-mask.svg)", maskSize: "100% 100%" }}>
          <div className="absolute origin-top-left" style={{ width: 146.994, height: 220.49, transform: "matrix(0.7523857,0.6587228,-0.6587228,0.7523857,41.418,-60.398)" }}>
            <ArtworkLayer asset="engraved-texture.png" x={0} y={0} width={146.994} height={220.49} />
            {/* Approved unbound overlay fill, not a shared token. */}
            <div className="absolute inset-0 bg-[#f4713a] mix-blend-overlay" />
          </div>
        </div>
      </div>
    </ScaledCanvas>
  );
}
