import Image from "next/image";
import { CtaPhoto } from "./cta-artwork";

// Figma 440:4680. Only the portions visible inside the 370 × 527 mobile
// frame are rendered. Keep their native scale and attach each to its corner;
// these illustration coordinates do not position functional card content.
const mobileLines = [
  { asset: "mobile-line-vertical.svg", x: 344.16, y: -60.59, width: 116.589, angle: 90, edge: "top" },
  { asset: "mobile-line-diagonal.svg", x: 307.06, y: -23.49, width: 173.027, angle: 27.35, edge: "top" },
  { asset: "mobile-line-shallow.svg", x: 264.67, y: 18.9, width: 199.56, angle: 10.71, edge: "top" },
  { asset: "mobile-line-diagonal.svg", x: 355.06, y: 495.49, width: 173.027, angle: -27.35, edge: "bottom" },
  { asset: "mobile-line-shallow.svg", x: 312.67, y: 473.1, width: 199.56, angle: -10.71, edge: "bottom" },
] as const;

export function CtaMobileArtwork() {
  return (
    <div aria-hidden="true" data-slot="cta-mobile-artwork" className="pointer-events-none absolute inset-0 select-none overflow-hidden md:hidden">
      <div className="absolute left-0 top-0 h-[527px] w-[370px]">
        <div className="absolute left-[54px] top-[-10px] size-[30px] border-b border-r border-white/35" />
        <CtaPhoto src="/assets/images/business-lines/commercial-auto-riso.png" mask="top-left-mask.svg" x={-47} y={-20} width={140} height={126} maskPosition="-16px -23px" maskSize="117.5px 117.5px" />
      </div>
      <div className="absolute bottom-0 left-0 h-[527px] w-[370px]">
        <div className="absolute left-[-43px] top-[344px] h-[79px] w-[71px] border-y border-r border-white/35" />
        <CtaPhoto src="/assets/images/business-lines/energy-marine-riso.png" mask="bottom-left-mask.svg" x={-101} y={387} width={236} height={193} maskPosition="38px 36px" maskSize="148px 80px" />
      </div>
      {(["top", "bottom"] as const).map((edge) => (
        <div key={edge} className={`absolute right-0 h-[527px] w-[370px] overflow-hidden ${edge === "top" ? "top-0" : "bottom-0"}`}>
          {edge === "top" ? (
            <>
              <div className="absolute left-[227.57px] top-[-58.82px] h-[114.822px] w-[233.178px] border border-white/35" />
              <CtaPhoto src="/assets/images/hero/riso-landscape.png" mask="accent-small-mask.svg" x={110} y={-204} width={365} height={244} maskPosition="152.898px 178.738px" maskSize="45.93px 45.93px" transform="scaleY(-1)" />
            </>
          ) : (
            <>
              <div className="absolute left-[276px] top-[442px] h-[89px] w-[233px] border border-white/35" />
              <CtaPhoto src="/assets/images/hero/riso-landscape.png" mask="accent-small-mask.svg" x={158} y={452} width={365} height={244} maskPosition="152.898px 19.332px" maskSize="45.93px 45.93px" />
            </>
          )}
          {mobileLines.filter((line) => line.edge === edge).map((line) => (
            <Image key={line.asset} src={`/assets/icons/cta/${line.asset}`} alt="" width={line.width} height={1} className="absolute max-w-none" style={{ left: line.x, top: line.y, width: line.width, height: 1, transform: `rotate(${line.angle}deg)`, transformOrigin: "left center" }} data-slot="cta-mobile-linework" />
          ))}
        </div>
      ))}
    </div>
  );
}
