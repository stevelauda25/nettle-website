import Image from "next/image";
import { ScaledCanvas } from "@/components/visuals/product-dashboard";

// Figma 415:4213. Preserve the separate orbital/axis layers and the photo's
// original crop; these are deliberately not the loss-control composition.
export function UnderwritingVisual() {
  return (
    <ScaledCanvas width={500} height={346} label="Underwriting illustration with a masked archival photograph and intersecting orbital linework" className="rounded-none">
      <div
        data-slot="underwriting-photo"
        className="absolute"
        style={{ left: 147.781, top: 40.584, width: 243.931, height: 253.224, maskImage: "url(/assets/icons/solutions-by-role/underwriting-mask.svg)", maskPosition: "18.903px 18.585px", maskSize: "166.63px 227.669px", maskRepeat: "no-repeat" }}
      >
        <Image src="/assets/images/solutions-by-role/underwriting-photo.png" alt="" fill sizes="244px" className="object-cover" />
      </div>
      <div data-slot="underwriting-ellipse" className="absolute" style={{ left: 81.5, top: 102.505, width: 337, height: 141 }}>
        <Image src="/assets/icons/solutions-by-role/underwriting-ellipse.svg" alt="" fill />
      </div>
      <div data-slot="underwriting-horizontal-axis" className="absolute rotate-90" style={{ left: 249.5, top: -35.995, width: 1, height: 418 }}>
        <Image src="/assets/icons/solutions-by-role/underwriting-horizontal-axis.svg" alt="" fill />
      </div>
      <div data-slot="underwriting-vertical-axis" className="absolute rotate-180" style={{ left: 249.5, top: 22.005, width: 1, height: 302 }}>
        <Image src="/assets/icons/solutions-by-role/underwriting-vertical-axis.svg" alt="" fill />
      </div>
      <div data-slot="underwriting-upper-ring" className="absolute" style={{ left: 157.5, top: 58.505, width: 185, height: 185.135 }}>
        <Image src="/assets/icons/solutions-by-role/underwriting-ring.svg" alt="" fill />
      </div>
      <div data-slot="underwriting-lower-ring" className="absolute -scale-y-100" style={{ left: 157.5, top: 102.37, width: 185, height: 185.135 }}>
        <Image src="/assets/icons/solutions-by-role/underwriting-ring.svg" alt="" fill />
      </div>
    </ScaledCanvas>
  );
}
