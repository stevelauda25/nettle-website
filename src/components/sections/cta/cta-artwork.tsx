import Image from "next/image";
import type { CSSProperties } from "react";
import { ScaledCanvas } from "@/components/visuals/product-dashboard";
import { ctaLinework } from "./artwork-data";

type CtaPhotoProps = {
  src: string;
  mask: string;
  x: number;
  y: number;
  width: number;
  height: number;
  maskPosition: string;
  maskSize: string;
  transform?: CSSProperties["transform"];
};

export function CtaPhoto({ src, mask, x, y, width, height, maskPosition, maskSize, transform }: CtaPhotoProps) {
  return (
    <div
      data-slot="cta-photo"
      className="absolute"
      style={{ left: x, top: y, width, height, maskImage: `url(/assets/icons/cta/${mask})`, maskPosition, maskSize, maskRepeat: "no-repeat", maskMode: "alpha" }}
    >
      <Image src={src} alt="" fill sizes={`${Math.ceil(width)}px`} className="object-cover" style={{ transform }} />
    </div>
  );
}

// The source clips these compositions at the panel edges. Keep their exact
// masks/crops and 35%-white vector exports; no reconstructed SVG paths.
// Separate top/bottom anchors preserve the edge treatment as the panel narrows.
export function CtaArtwork() {
  return (
    <div aria-hidden="true" data-slot="cta-artwork" className="pointer-events-none absolute inset-0 hidden select-none overflow-hidden xl:block">
      {(["top", "bottom"] as const).map((edge) => (
        <div key={edge} className={`absolute inset-x-0 ${edge === "top" ? "top-0" : "bottom-0"}`}>
          <ScaledCanvas width={1376} height={527} label="Decorative CTA collage" className="rounded-none">
            {ctaLinework.filter((layer) => layer.edge === edge).map((layer) => (
              <Image key={layer.asset} src={`/assets/icons/cta/${layer.asset}`} alt="" width={layer.width} height={layer.height} className="absolute" style={{ left: layer.x, top: layer.y, width: layer.width, height: layer.height }} data-slot="cta-linework" />
            ))}
            {edge === "top" ? (
              <>
                <CtaPhoto src="/assets/images/business-lines/commercial-auto-riso.png" mask="top-left-mask.svg" x={-7} y={-10} width={140} height={126} maskPosition="-16px -23px" maskSize="117.5px 117.5px" />
                <CtaPhoto src="/assets/images/cta/top-right-photo.png" mask="top-right-mask.svg" x={1172} y={-73} width={146} height={188} maskPosition="13px 20px" maskSize="120px 160px" />
                <CtaPhoto src="/assets/images/hero/riso-landscape.png" mask="accent-small-mask.svg" x={241} y={-224} width={365} height={244} maskPosition="152.898px 178.738px" maskSize="45.93px 45.93px" transform="scaleY(-1)" />
              </>
            ) : (
              <>
                <CtaPhoto src="/assets/images/hero/riso-landscape.png" mask="accent-small-mask.svg" x={1181} y={419} width={365} height={244} maskPosition="152.898px 19.332px" maskSize="45.93px 45.93px" />
                <CtaPhoto src="/assets/images/hero/riso-landscape.png" mask="accent-large-mask.svg" x={588} y={423} width={593.543} height={395.695} maskPosition="380.231px 74.824px" maskSize="116.59px 116.59px" transform="scaleX(-1)" />
                <CtaPhoto src="/assets/images/business-lines/energy-marine-riso.png" mask="bottom-left-mask.svg" x={-58} y={367} width={236} height={193} maskPosition="38px 36px" maskSize="148px 80px" />
              </>
            )}
          </ScaledCanvas>
        </div>
      ))}
    </div>
  );
}
