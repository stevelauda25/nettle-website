import Image from "next/image";
import {
  ACCENT_HEIGHT,
  ACCENT_WIDTH,
  brandAccents,
  type AccentComposition,
  type BrandAccentVariant,
} from "./compositions";

const squareFill = {
  "warm-gray-500": "bg-warm-gray-500",
  "neon-green-500": "bg-neon-green-500",
  // Raw #FAFAFA in Figma — no matching color variable.
  "raw-fafafa": "bg-[#fafafa]",
} as const;

type BrandAccentProps = {
  /** A preset from Figma, or a custom composition with the same layer structure. */
  variant: BrandAccentVariant | AccentComposition;
  className?: string;
};

/**
 * Decorative engraving/linework composition (385×198) used beside hero copy.
 * Always aria-hidden. Layers carry data-slot attributes so they can be targeted
 * individually (e.g. staggered reveal) without changing this markup.
 */
export function BrandAccent({ variant, className = "" }: BrandAccentProps) {
  const composition = typeof variant === "string" ? brandAccents[variant] : variant;
  const { lines, squares, photos, arrow, label } = composition;

  return (
    <div
      aria-hidden="true"
      data-slot="brand-accent"
      className={`pointer-events-none select-none ${className}`}
      style={{ width: ACCENT_WIDTH, height: ACCENT_HEIGHT }}
    >
      <div className="relative size-full">
        {squares.map((square) => (
          <div
            key={`${square.x}-${square.y}`}
            data-slot="accent-square"
            className={`absolute outline outline-brand-950/10 ${square.fill ? squareFill[square.fill] : ""}`}
            style={{ left: square.x, top: square.y, width: square.width, height: square.height }}
          />
        ))}

        <svg
          data-slot="accent-lines"
          className="absolute inset-0 overflow-visible stroke-brand-950/10"
          width={ACCENT_WIDTH}
          height={ACCENT_HEIGHT}
          viewBox={`0 0 ${ACCENT_WIDTH} ${ACCENT_HEIGHT}`}
          fill="none"
        >
          {lines.map((line) => (
            <line key={`${line.x1}-${line.y1}-${line.x2}-${line.y2}`} {...line} strokeWidth={1} />
          ))}
        </svg>

        {photos.map((photo) => (
          <div
            key={`${photo.src}-${photo.x}`}
            data-slot="accent-photo"
            className="absolute overflow-hidden"
            style={{ left: photo.x, top: photo.y, width: photo.width, height: photo.height }}
          >
            <Image
              src={photo.src}
              alt=""
              width={Math.round(photo.imageWidth)}
              height={Math.round(photo.imageHeight)}
              sizes={`${Math.ceil(photo.imageWidth)}px`}
              className={`absolute max-w-none object-cover ${photo.mirrored ? "-scale-x-100" : ""}`}
              style={{
                left: photo.offsetX,
                top: photo.offsetY,
                width: photo.imageWidth,
                height: photo.imageHeight,
              }}
            />
          </div>
        ))}

        <div
          data-slot="accent-arrow"
          className="absolute"
          style={{ left: arrow.x, top: arrow.y, width: arrow.width, height: arrow.height }}
        >
          {arrow.parts.map((part) => (
            <div
              key={part.src}
              className="absolute flex items-center justify-center"
              style={{ left: part.x, top: part.y, width: part.boxWidth, height: part.boxHeight }}
            >
              <div
                className={`relative flex-none ${arrow.transform}`}
                style={{ width: part.width, height: part.height }}
              >
                <Image src={part.src} alt="" fill />
              </div>
            </div>
          ))}
        </div>

        <p
          data-slot="accent-label"
          className="absolute text-handwritten text-warm-gray-800"
          style={{ left: label.x, top: label.y, width: label.width }}
        >
          {label.text}
        </p>
      </div>
    </div>
  );
}
