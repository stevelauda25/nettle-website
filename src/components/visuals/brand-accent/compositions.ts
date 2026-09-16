// Figma: Hero › hero-content › left/right › accent-imagery (388:5727, 388:5766).
// All coordinates are px inside the 385×198 composition box, taken from the Figma frame.
// "field-inspection" is the "commercial-properties" geometry mirrored; its values are
// already mirrored here so both render without transforms on the whole group.

export const ACCENT_WIDTH = 385;
export const ACCENT_HEIGHT = 198;

export type AccentLine = { x1: number; y1: number; x2: number; y2: number };

export type AccentSquare = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: "warm-gray-500" | "neon-green-500" | "raw-fafafa";
};

export type AccentPhoto = {
  src: string;
  // Visible (masked) box
  x: number;
  y: number;
  width: number;
  height: number;
  // Full image size and its offset inside the visible box
  imageWidth: number;
  imageHeight: number;
  offsetX: number;
  offsetY: number;
  mirrored: boolean;
};

export type AccentArrowPart = {
  src: string;
  // Rotated bounding box (Figma) and the unrotated asset inside it
  x: number;
  y: number;
  boxWidth: number;
  boxHeight: number;
  width: number;
  height: number;
};

export type AccentArrow = {
  x: number;
  y: number;
  width: number;
  height: number;
  transform: string;
  parts: AccentArrowPart[];
};

export type AccentComposition = {
  lines: AccentLine[];
  squares: AccentSquare[];
  photos: AccentPhoto[];
  arrow: AccentArrow;
  label: { text: string; x: number; y: number; width: number };
};

// Geometry of the right composition (unmirrored).
const rightLines: AccentLine[] = [
  { x1: 199.5, y1: 66, x2: 199.5, y2: 130 },
  { x1: 133.5, y1: 0, x2: 133.5, y2: 66 },
  { x1: 199, y1: 65.5, x2: 321, y2: 65.5 },
  { x1: 227, y1: 158, x2: 321, y2: 66 },
  { x1: 67, y1: 0, x2: 200, y2: 130 },
  { x1: 67, y1: 0, x2: 154, y2: 45 },
  { x1: 67, y1: 0, x2: 178, y2: 21 },
  { x1: 67, y1: 0, x2: 133, y2: 197 },
  { x1: 237, y1: 169, x2: 385, y2: 131 },
];

const mirrorLine = ({ x1, y1, x2, y2 }: AccentLine): AccentLine => ({
  x1: ACCENT_WIDTH - x1,
  y1,
  x2: ACCENT_WIDTH - x2,
  y2,
});

const commercialProperties: AccentComposition = {
  lines: rightLines,
  squares: [
    { x: 67, y: 0, width: 132, height: 65 },
    { x: 200, y: 130, width: 65, height: 66 },
    { x: 0, y: 66, width: 66, height: 66, fill: "raw-fafafa" },
    { x: 226, y: 157, width: 12, height: 12, fill: "neon-green-500" },
    { x: 321, y: 66, width: 64, height: 64, fill: "warm-gray-500" },
  ],
  photos: [
    {
      src: "/assets/images/hero/riso-landscape.png",
      x: 154, y: 21, width: 24, height: 24,
      imageWidth: 189, imageHeight: 126, offsetX: -150, offsetY: -35,
      mirrored: false,
    },
    {
      src: "/assets/images/hero/riso-building.png",
      x: 133, y: 129, width: 66, height: 68,
      imageWidth: 219, imageHeight: 197, offsetX: -5, offsetY: -2,
      mirrored: false,
    },
    {
      src: "/assets/images/hero/riso-street.png",
      x: 321, y: 66, width: 64, height: 64,
      imageWidth: 205.437, imageHeight: 128, offsetX: -18, offsetY: -30,
      mirrored: false,
    },
  ],
  arrow: {
    x: 72.32, y: 170.37, width: 48.652, height: 27.779,
    transform: "-scale-y-100 rotate-[-14.44deg] skew-x-[-5.55deg]",
    parts: [
      {
        src: "/assets/icons/hero/arrow-right-shaft.svg",
        x: 0, y: 0, boxWidth: 46.273, boxHeight: 27.779, width: 45.114, height: 16.727,
      },
      {
        src: "/assets/icons/hero/arrow-right-head.svg",
        x: 34.01, y: 9.09, boxWidth: 10.4, boxHeight: 4.691, width: 10.401, height: 2.122,
      },
    ],
  },
  label: { text: "Commercial properties", x: 7, y: 152, width: 73 },
};

const fieldInspection: AccentComposition = {
  lines: rightLines.map(mirrorLine),
  squares: [
    { x: 186, y: 0, width: 132, height: 65 },
    { x: 120, y: 130, width: 65, height: 66 },
    { x: 319, y: 66, width: 66, height: 66, fill: "raw-fafafa" },
    { x: 147, y: 157, width: 12, height: 12, fill: "warm-gray-500" },
  ],
  photos: [
    {
      src: "/assets/images/hero/riso-landscape.png",
      x: 207, y: 21, width: 24, height: 24,
      imageWidth: 336, imageHeight: 224, offsetX: -287, offsetY: -83,
      mirrored: true,
    },
    {
      src: "/assets/images/hero/riso-surveyor.png",
      x: 186, y: 129, width: 66, height: 68,
      imageWidth: 199, imageHeight: 248, offsetX: -112, offsetY: -108,
      mirrored: false,
    },
    {
      src: "/assets/images/hero/riso-landscape.png",
      x: 0, y: 66, width: 64, height: 64,
      imageWidth: 336, imageHeight: 224, offsetX: -176, offsetY: -91,
      mirrored: true,
    },
  ],
  arrow: {
    x: 16.26, y: 15.69, width: 48.001, height: 40.039,
    // Figma's exported transform for this mirrored group renders a reflected curve in CSS;
    // these values were matched against the Figma render by overlay.
    transform: "rotate-[-39.09deg] -scale-x-100 scale-y-98 skew-x-[12.72deg]",
    parts: [
      {
        src: "/assets/icons/hero/arrow-left-shaft.svg",
        x: 0, y: 0, boxWidth: 40.156, boxHeight: 40.039, width: 43.81, height: 13.855,
      },
      {
        src: "/assets/icons/hero/arrow-left-head.svg",
        x: 5.82, y: 22.33, boxWidth: 8.69, boxHeight: 8.006, width: 10.186, height: 1.767,
      },
    ],
  },
  label: { text: "Field inspection", x: 75, y: 11, width: 73 },
};

export const brandAccents = {
  "field-inspection": fieldInspection,
  "commercial-properties": commercialProperties,
} satisfies Record<string, AccentComposition>;

export type BrandAccentVariant = keyof typeof brandAccents;
