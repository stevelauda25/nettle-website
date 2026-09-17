import Image from "next/image";
import type { CSSProperties } from "react";
import { ScaledCanvas } from "@/components/visuals/product-dashboard";
import type { BusinessLine } from "./data";

type Layer = {
  asset: string;
  x: number;
  y: number;
  width: number;
  height: number;
  transform?: string;
  mask?: { asset: string; x: number; y: number; width: number; height: number; matrix?: [number, number, number, number] };
};

const assetPath = (asset: string) => `/assets/${asset.endsWith(".svg") ? "icons" : "images"}/business-lines/${asset}`;

// Coordinates are local to Figma's 448px illustration canvas. Vector layers
// retain their exported stroke bounds; photos retain the exact Figma masks.
const layers: Record<BusinessLine["visual"], Layer[]> = {
  "commercial-property": [
    { asset: "property-linework.svg", x: 59.797, y: 28, width: 328.686, height: 349.499 },
    { asset: "property-riso.png", x: 22.301, y: 76.116, width: 401.418, height: 477.928, mask: { asset: "property-mask-bottom.svg", x: 78.188, y: 161.051, width: 247.926, height: 70.168 } },
    { asset: "property-riso.png", x: -84.612, y: 96.176, width: 431.381, height: 513.603, mask: { asset: "property-mask-top.svg", x: 187.383, y: 52.78, width: 171.048, height: 171.048, matrix: [0.70710678, -0.70710678, 0.70710678, 0.70710678] } },
  ],
  "workers-compensation": [
    { asset: "workers-riso.png", x: 136.42, y: 45.84, width: 270.909, height: 310.205, mask: { asset: "workers-mask-right.svg", x: 87.574, y: 105.512, width: 101.293, height: 101.293 } },
    { asset: "workers-riso.png", x: 83.668, y: 76.442, width: 270.909, height: 310.205, mask: { asset: "workers-mask-left.svg", x: 140.331, y: 74.914, width: 101.291, height: 101.291, matrix: [-1, 0, 0, 1] } },
    { asset: "workers-axis-vertical.svg", x: 223.5, y: 68, width: 1, height: 268 },
    { asset: "workers-axis-horizontal.svg", x: 223.5, y: 6.803, width: 1, height: 390.394, transform: "rotate(90deg)" },
    ...([
      ["outer", 156.157, 123.92],
      ["inner", 71.748, 166.13],
      ["middle", 101.291, 151.35],
      ["midouter", 130.835, 136.58],
      ["center", 48.535, 177.73],
    ] as const).flatMap(([name, size, y]) => [
      { asset: `workers-circle-${name}-right.svg`, x: 223.5, y: y - 0.5, width: size + 1, height: size + 1 },
      { asset: `workers-circle-${name}-left.svg`, x: 223.5 - size, y: y - 0.5, width: size + 1, height: size + 1, transform: "scaleX(-1)" },
    ]),
  ],
  liability: [
    { asset: "liability-riso.png", x: 143, y: 18, width: 271, height: 339, mask: { asset: "liability-mask.svg", x: 47, y: 105.148, width: 68, height: 150.703 } },
    { asset: "liability-circle.svg", x: 56.5, y: 97.5, width: 202, height: 202 },
    { asset: "liability-circle.svg", x: 189.5, y: 97.5, width: 202, height: 202 },
    { asset: "liability-marker-left.svg", x: 153, y: 164.667, width: 5.333, height: 68.667, transform: "rotate(-90deg)" },
    { asset: "liability-marker-right.svg", x: 289.417, y: 164.417, width: 5.333, height: 69.167, transform: "rotate(-90deg)" },
  ],
  construction: [
    { asset: "construction-riso.png", x: 50, y: 61, width: 257, height: 348, mask: { asset: "construction-mask-small.svg", x: 66, y: 112, width: 60, height: 30 } },
    { asset: "construction-riso.png", x: 70, y: 61, width: 257, height: 348, mask: { asset: "construction-mask-large.svg", x: 257, y: 210, width: 136, height: 68, matrix: [-1, 0, 0, -1] } },
    { asset: "construction-circle-small.svg", x: 79.5, y: 191.5, width: 23, height: 23 },
    { asset: "construction-circle-medium.svg", x: 115.5, y: 172.5, width: 61, height: 61 },
    { asset: "construction-circle-large.svg", x: 190.5, y: 134.5, width: 137, height: 137 },
    { asset: "construction-line-horizontal.svg", x: 58, y: 202, width: 332.843, height: 1 },
    { asset: "construction-line-vertical.svg", x: 108.173, y: 201.277, width: 163.974, height: 1, transform: "rotate(90deg)" },
    { asset: "construction-line-diagonal-up.svg", x: 49.917, y: 155.5, width: 275.587, height: 1, transform: "rotate(-19.72deg)" },
    { asset: "construction-line-diagonal-down.svg", x: 49.917, y: 249.5, width: 275.587, height: 1, transform: "rotate(19.72deg) scaleY(-1)" },
  ],
  "commercial-auto": [
    { asset: "commercial-auto-riso.png", x: 130, y: 112, width: 187, height: 168, mask: { asset: "commercial-auto-mask-top.svg", x: 10.5, y: 0.5, width: 83.5, height: 83.5 } },
    { asset: "commercial-auto-riso.png", x: 130, y: 112, width: 187, height: 168, mask: { asset: "commercial-auto-mask-bottom.svg", x: 177.5, y: 167.5, width: 83.5, height: 83.5, matrix: [-1, 0, 0, -1] } },
    { asset: "commercial-auto-axis-left.svg", x: 223.52, y: 43.202, width: 1.003, height: 305.597, transform: "rotate(-45deg)" },
    { asset: "commercial-auto-axis-right.svg", x: 223.507, y: 43.19, width: 1.006, height: 305.599, transform: "rotate(45deg)" },
    { asset: "commercial-auto-square.svg", x: 140.064, y: 112.064, width: 167.888, height: 167.888, transform: "rotate(-45deg)" },
  ],
  "high-net-worth": [
    { asset: "high-net-worth-riso.png", x: 119, y: 110, width: 210, height: 294, mask: { asset: "high-net-worth-mask-left.svg", x: -1, y: 89, width: 105.5, height: 53.5 } },
    { asset: "high-net-worth-riso.png", x: 119, y: 110, width: 210, height: 294, mask: { asset: "high-net-worth-mask-right.svg", x: 210.5, y: 88.5, width: 105.5, height: 53.5, matrix: [-1, 0, 0, -1] } },
    { asset: "high-net-worth-line.svg", x: 81.15, y: 198.05, width: 284.704, height: 1 },
    { asset: "high-net-worth-diamond.svg", x: 158.535, y: 198.05, width: 129.944, height: 112.534 },
    { asset: "high-net-worth-diamond.svg", x: 158.535, y: 87.506, width: 129.944, height: 112.534, transform: "scaleY(-1)" },
    { asset: "high-net-worth-trapezoid.svg", x: 117.257, y: 198.488, width: 212.492, height: 54.442 },
    { asset: "high-net-worth-trapezoid.svg", x: 117.257, y: 145.168, width: 212.492, height: 54.442, transform: "scaleY(-1)" },
  ],
  "energy-marine": [
    { asset: "energy-marine-riso.png", x: 124, y: 110, width: 202, height: 165, mask: { asset: "energy-marine-mask-top.svg", x: 42, y: 0, width: 58.5, height: 82.5 } },
    { asset: "energy-marine-riso.png", x: 124, y: 110, width: 202, height: 165, mask: { asset: "energy-marine-mask-bottom.svg", x: 158.5, y: 164.5, width: 58.5, height: 82.5, matrix: [-1, 0, 0, -1] } },
    { asset: "energy-marine-circle.svg", x: 141.398, y: 109.39, width: 165.224, height: 165.224 },
    { asset: "energy-marine-line-horizontal.svg", x: 101, y: 191.5, width: 246, height: 1, transform: "rotate(90deg)" },
    { asset: "energy-marine-line-short.svg", x: 107.432, y: 191.498, width: 115.657, height: 1, transform: "rotate(90deg)" },
    { asset: "energy-marine-line-short.svg", x: 224.012, y: 191.498, width: 115.657, height: 1, transform: "rotate(90deg)" },
    { asset: "energy-marine-line-mid.svg", x: 101, y: 191.01, width: 246, height: 1 },
    { asset: "energy-marine-line-diagonal-a.svg", x: 120.19, y: 191.414, width: 207.448, height: 1, transform: "rotate(-135deg)" },
    { asset: "energy-marine-line-diagonal-b.svg", x: 120.18, y: 191.414, width: 207.448, height: 1, transform: "rotate(-45deg) scaleY(-1)" },
  ],
};

function ArtworkLayer({ layer }: { layer: Layer }) {
  if (layer.mask?.matrix) {
    const { mask } = layer;
    const [a, b, c, d] = mask.matrix!;
    const determinant = a * d - b * c;
    const inverse = [d / determinant, -b / determinant, -c / determinant, a / determinant];
    const tx = -(inverse[0] * mask.x + inverse[2] * mask.y);
    const ty = -(inverse[1] * mask.x + inverse[3] * mask.y);
    return (
      <div className="absolute origin-top-left" style={{
        left: layer.x + mask.x, top: layer.y + mask.y, width: mask.width, height: mask.height,
        transform: `matrix(${a},${b},${c},${d},0,0)`,
        maskImage: `url(${assetPath(mask.asset)})`, maskSize: "100% 100%", maskRepeat: "no-repeat",
      }}>
        <div className="absolute top-0 left-0 origin-top-left" style={{ width: layer.width, height: layer.height, transform: `matrix(${inverse.join(",")},${tx},${ty})` }}>
          <Image src={assetPath(layer.asset)} alt="" fill sizes={`${Math.ceil(layer.width)}px`} className="object-cover" />
        </div>
      </div>
    );
  }
  const style: CSSProperties = {
    left: layer.x, top: layer.y, width: layer.width, height: layer.height,
    transform: layer.transform,
    ...(layer.mask && {
      maskImage: `url(${assetPath(layer.mask.asset)})`,
      maskPosition: `${layer.mask.x}px ${layer.mask.y}px`,
      maskSize: `${layer.mask.width}px ${layer.mask.height}px`,
      maskRepeat: "no-repeat",
    }),
  };
  return (
    <div className="absolute" style={style}>
      <Image src={assetPath(layer.asset)} alt="" fill sizes={`${Math.ceil(layer.width)}px`} className={layer.mask ? "object-cover" : ""} />
    </div>
  );
}

export function BusinessLineArtwork({ line }: { line: BusinessLine }) {
  return (
    <ScaledCanvas width={448} height={385} label={`${line.name} illustration`} className="rounded-none">
      <div data-slot="business-line-artwork" className="absolute inset-0">
        {layers[line.visual].map((layer, index) => <ArtworkLayer key={index} layer={layer} />)}
        {line.visual === "commercial-auto" && (
          // Unbound #D1CFCC matches the exported Figma linework, not a new token.
          <>
            <div className="absolute top-[112.55px] left-[140.57px] size-[166.888px] border border-[#d1cfcc]" />
            <div className="absolute top-[137.48px] left-[165.5px] size-[117.039px] -rotate-45 border border-[#d1cfcc]" />
            <div className="absolute top-[154.81px] left-[182.81px] size-[82.385px] border border-[#d1cfcc]" />
          </>
        )}
      </div>
    </ScaledCanvas>
  );
}
