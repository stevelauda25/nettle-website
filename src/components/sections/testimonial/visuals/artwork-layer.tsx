import Image from "next/image";
import type { CSSProperties } from "react";

type ArtworkLayerProps = {
  asset: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: CSSProperties;
};

// Only decorative canvas layers use coordinates. Card content follows the grid.
export function ArtworkLayer({ asset, x, y, width, height, style }: ArtworkLayerProps) {
  return (
    <div className="absolute" style={{ left: x, top: y, width, height, ...style }}>
      <Image src={`/assets/${asset.endsWith(".svg") ? "icons" : "images"}/testimonial/${asset}`} alt="" fill sizes={`${Math.ceil(width)}px`} className="object-cover" />
    </div>
  );
}
