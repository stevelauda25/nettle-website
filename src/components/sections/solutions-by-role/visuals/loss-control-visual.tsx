import Image from "next/image";
import { ScaledCanvas } from "@/components/visuals/product-dashboard";

// Figma 415:4199: photo, exact vector mask, then the exported linework.
// All coordinates are internal to the approved 500 × 346 illustration.
export function LossControlVisual() {
  return (
    <ScaledCanvas width={500} height={346} label="Loss control illustration with a masked archival photograph and conical linework" className="rounded-none">
      <div
        data-slot="loss-control-photo"
        className="absolute"
        style={{ left: -15, top: -11, width: 403, height: 334, maskImage: "url(/assets/icons/solutions-by-role/loss-control-mask.svg)", maskPosition: "199.939px 94.672px", maskSize: "130.167px 186px", maskRepeat: "no-repeat" }}
      >
        <Image src="/assets/images/solutions-by-role/loss-control-photo.png" alt="" fill sizes="403px" className="object-cover" />
      </div>
      <div data-slot="loss-control-linework" className="absolute" style={{ left: 78.5, top: 28.144, width: 343, height: 287.991 }}>
        <Image src="/assets/icons/solutions-by-role/loss-control-linework.svg" alt="" fill />
      </div>
    </ScaledCanvas>
  );
}
