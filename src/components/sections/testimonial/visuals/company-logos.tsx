import Image from "next/image";

// Exact vector glyphs from Figma 415:4260 in its approved 139 × 36 canvas.
const allianzGlyphs = [
  { asset: "allianz-a-cap.svg", inset: "17.09% 85.45% 21.71% 0" },
  { asset: "allianz-l.svg", inset: "17.09% 80.53% 21.71% 14.66%" },
  { asset: "allianz-l-second.svg", inset: "17.09% 74.11% 21.71% 21.08%" },
  { asset: "allianz-i.svg", inset: "16.08% 67.58% 21.71% 27.6%" },
  { asset: "allianz-a.svg", inset: "31.84% 54.64% 21.27% 34.25%" },
  { asset: "allianz-n.svg", inset: "31.92% 42.5% 21.71% 46.05%" },
  { asset: "allianz-z.svg", inset: "32.45% 31.5% 21.72% 59.33%", flip: true },
  { asset: "allianz-eagle.svg", inset: "-0.01% 0 0.49% 74.11%", flip: true },
];

export function AllianzLogo() {
  return (
    <div role="img" aria-label="Allianz" className="relative h-9 w-[139px] shrink-0" data-slot="company-logo">
      {allianzGlyphs.map(({ asset, inset, flip }) => (
        <div key={asset} aria-hidden="true" className="absolute" style={{ inset, transform: flip ? "scaleY(-1)" : undefined }}>
          <Image src={`/assets/icons/testimonial/${asset}`} alt="" fill />
        </div>
      ))}
    </div>
  );
}

export function BrotherhoodLogo() {
  return <Image src="/assets/icons/testimonial/brotherhood-logo.svg" alt="Brotherhood Mutual" width={145} height={36} className="h-9 w-[145px] shrink-0" data-slot="company-logo" />;
}
