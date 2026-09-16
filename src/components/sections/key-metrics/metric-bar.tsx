// Figma: Key Metrics "Mask group" bars (392:6918, 392:6925, 392:6932).
// Each bar is a 369.667×22 alpha mask over a transformed halftone image with a
// brand-400 overlay fill. The transforms below are the Figma relativeTransform /
// imageTransform values (bar-local), so the approved source images render
// exactly as composed instead of as a flattened 1x export.
const BAR_WIDTH = 369.667;
const BAR_HEIGHT = 22;

export type MetricBarVariant = "surveys" | "decisions" | "visibility";

type BarLayer = {
  href: string;
  // Transform of the image rectangle inside the bar (SVG matrix order).
  transform: string;
  width: number;
  height: number;
  // Image placement inside that rectangle.
  image: { transform?: string; width: number; height: number; preserveAspectRatio: string };
};

const engravedInk = {
  href: "/assets/images/key-metrics/engraved-ink.png",
  width: 381.829,
  height: 573.922,
  image: { width: 381.829, height: 573.922, preserveAspectRatio: "xMidYMid meet" },
};

const layers: Record<MetricBarVariant, BarLayer> = {
  surveys: { ...engravedInk, transform: "matrix(0.65505 0.755586 0.936275 -0.351267 -250 -115.4005)" },
  decisions: { ...engravedInk, transform: "matrix(0.65505 0.755586 0.936275 -0.351267 -263.666 -5.4005)" },
  visibility: {
    href: "/assets/images/key-metrics/halftone-band.png",
    transform: "matrix(0 1 -1 0 369.666 -126)",
    width: 275,
    height: 371,
    // Figma CROP fill: the 1024×682 image rotated 90° and scaled uniformly.
    image: { transform: "matrix(0 0.362305 -0.362305 0 261.05 0)", width: 1024, height: 682, preserveAspectRatio: "none" },
  },
};

type MetricBarProps = {
  variant: MetricBarVariant;
  className?: string;
};

export function MetricBar({ variant, className = "" }: MetricBarProps) {
  const layer = layers[variant];
  const clipId = `metric-bar-${variant}-clip`;

  return (
    <svg
      aria-hidden="true"
      data-slot="metric-bar"
      viewBox={`0 0 ${BAR_WIDTH} ${BAR_HEIGHT}`}
      // Uniform scale when the card is wider than in Figma (stacked layouts),
      // so the halftone dots are never stretched.
      preserveAspectRatio="xMidYMid slice"
      className={`block h-5.5 w-full overflow-hidden ${className}`}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width={layer.width} height={layer.height} />
        </clipPath>
      </defs>
      <g transform={layer.transform} clipPath={`url(#${clipId})`} className="isolate">
        <image
          href={layer.href}
          width={layer.image.width}
          height={layer.image.height}
          transform={layer.image.transform}
          preserveAspectRatio={layer.image.preserveAspectRatio}
        />
        <rect width={layer.width} height={layer.height} className="fill-brand-400 mix-blend-overlay" />
      </g>
    </svg>
  );
}
