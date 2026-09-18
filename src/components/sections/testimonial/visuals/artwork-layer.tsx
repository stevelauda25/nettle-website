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

// These exports duplicate approved assets elsewhere. Share their delivery URLs
// without changing the local composition names or retaining separate cache keys.
const sharedAssets: Partial<Record<string, string>> = {
  "brotherhood-archive.png": "/assets/images/business-lines/property-riso.png",
  // Keep PNG as the optimizer input: WebP shrink-on-load changes resized pixels.
  "engraved-texture.png": "/assets/images/key-metrics/engraved-ink.png",
};

// Only decorative canvas layers use coordinates. Card content follows the grid.
export function ArtworkLayer({ asset, x, y, width, height, style }: ArtworkLayerProps) {
  return (
    <div className="absolute" style={{ left: x, top: y, width, height, ...style }}>
      <Image src={sharedAssets[asset] ?? `/assets/${asset.endsWith(".svg") ? "icons" : "images"}/testimonial/${asset}`} alt="" fill sizes={`${Math.ceil(width)}px`} className="object-cover" />
    </div>
  );
}
