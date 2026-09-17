import Image from "next/image";
import { ScaledCanvas } from "@/components/visuals/product-dashboard/scaled-canvas";

type SecurityArtworkProps = {
  badge: string;
  label: string;
};

// All three approved compositions share the same 370 × 299 linework and
// 86px badge at (260, 24). These are artwork coordinates, not page offsets.
// Extra ISO badges at x=464 are completely outside Figma's clipped cards.
// Badge SVGs keep the outer fill at black/2%; an explicit inset border replaces
// the exported outer inner-shadow filter, which brightened the translucent ring.
export function SecurityArtwork({ badge, label }: SecurityArtworkProps) {
  return (
    <ScaledCanvas width={370} height={299} label={label} className="pointer-events-none shrink-0 rounded-none">
      <Image src="/assets/icons/security/line-pattern.svg" alt="" width={370} height={299} className="absolute inset-0 h-[299px] w-[370px]" data-slot="security-linework" />
      <Image src={`/assets/icons/security/${badge}`} alt="" width={86} height={86} className="absolute top-6 left-[260px] size-[86px]" data-slot="security-badge" />
    </ScaledCanvas>
  );
}
