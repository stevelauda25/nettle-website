import { ScaledCanvas } from "@/components/visuals/product-dashboard";
import { ArtworkLayer } from "./artwork-layer";

// Figma 440:4296: mobile-specific linework and photo crops, not the desktop canvas.
export function AllianzMobileArtwork() {
  return (
    <ScaledCanvas width={340} height={255} label="Allianz mobile archival engineering collage" className="rounded-none">
      <div data-slot="allianz-mobile-artwork">
        <ArtworkLayer asset="allianz-mobile-linework.svg" x={-178} y={-81.456} width={574.083} height={336.456} />
        <ArtworkLayer asset="allianz-archive.png" x={-185.57} y={-46.58} width={459.981} height={344.986} style={{ maskImage: "url(/assets/icons/testimonial/allianz-mask-lower.svg)", maskPosition: "378.559px 128.465px", maskSize: "68.719px 88.352px", maskRepeat: "no-repeat" }} />
        <ArtworkLayer asset="allianz-archive.png" x={94.03} y={-13.63} width={204.799} height={153.599} style={{ maskImage: "url(/assets/icons/testimonial/allianz-mask-upper.svg)", maskPosition: "35.777px 9.348px", maskSize: "63.992px 86.352px", maskRepeat: "no-repeat" }} />
        {/* The orange accent in this frame is entirely outside the card crop. */}
      </div>
    </ScaledCanvas>
  );
}
