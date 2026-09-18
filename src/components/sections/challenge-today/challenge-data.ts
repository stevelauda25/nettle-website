export type ChallengeState = {
  id: "state-1" | "state-2" | "state-3";
  figmaNode: string;
  firstLine: string;
  secondLineLead: string;
  emphasis: string;
  suffix: string;
  underline: { src: string; width: number; height: number; offset: number };
};

export const challengeStates: readonly ChallengeState[] = [
  {
    id: "state-1", figmaNode: "566:5762",
    firstLine: "90% of your time is spent at the desk.",
    secondLineLead: "Your expertise ", emphasis: "belongs in the field.", suffix: "",
    underline: { src: "/assets/icons/challenge-today/state-1-underline.svg", width: 391.3, height: 10.2616, offset: 4 },
  },
  {
    id: "state-2", figmaNode: "409:3596",
    firstLine: "Backlogs grow as capacity shrinks.",
    secondLineLead: "Critical risks go ", emphasis: "unseen.", suffix: "",
    underline: { src: "/assets/icons/challenge-today/state-2-underline.svg", width: 155.469, height: 17.5734, offset: -1 },
  },
  {
    id: "state-3", figmaNode: "409:3612",
    firstLine: "Experienced engineers are retiring.",
    secondLineLead: "Decades of ", emphasis: "expertise leave", suffix: " with them.",
    underline: { src: "/assets/icons/challenge-today/state-3-underline.svg", width: 291.8, height: 19.8, offset: 6 },
  },
];

// Derived from all three 1440 × 928 Figma frames, not an invented zoom range.
// State 03 coordinates are the base. Center travel follows the recorded Figma
// geometry (<0.025px export rounding). The video-led zoom refinement preserves
// opening/final rectangles but intentionally frees intermediate image sizes.
export const challengeCamera = {
  width: 1440, height: 928,
  originX: 854.245, originY: 428.49,
  startScale: 3.1897556882092934,
  middleScale: 1.2712598042296264,
  endScale: 1,
} as const;

// Authored interaction settings, not Figma geometry. Each image gets a depth
// response from its visual role, apparent size and distance from the camera.
// No randomness or index-based stagger: moving/resizing an image changes its
// motion meaningfully. Endpoint geometry remains independent of this tuning.
export const challengeMotion = {
  middleProgress: 0.5,
  holdProgress: 0.85,
  mobileDepthStrength: 0.5,
  // Reference-video refinement: foreground keeps more zoom travel after the
  // middle statement. These are authored bounds, not a Figma middle crop.
  zoomMiddleRange: [1.06, 1.75],
  zoomMiddleVelocity: 2,
  weights: { role: 0.3, size: 0.35, position: 0.35 },
  roles: { near: 1, middle: 0.5, far: 0 },
  // Geometric-mean image size as a fraction of design-frame width. Area alone
  // would let the largest image dominate; this keeps secondary tiles distinct.
  sizeRange: [0.075, 0.35],
  derivatives: {
    near: [-8, -2.3, 0],
    middle: [(challengeCamera.middleScale - challengeCamera.startScale) / 0.5, -1.2, 0],
    far: [-0.8, -0.25, 0],
  },
} as const;

export type ChallengeDepth = keyof typeof challengeMotion.derivatives;

// A cubic Hermite segment maps exactly to this CSS cubic-bezier because its
// x control points make x(t) = t. Only static easing strings reach the DOM;
// the browser animates transform, not inherited custom properties.
function segmentEasing(distance: number, scaleChange: number, startSlope: number, endSlope: number) {
  return `cubic-bezier(${1 / 3}, ${distance * startSlope / (3 * scaleChange)}, ${2 / 3}, ${1 - distance * endSlope / (3 * scaleChange)})`;
}

function depthEasing(slopes: readonly number[], middleScale: number = challengeCamera.middleScale) {
  return {
    first: segmentEasing(challengeMotion.middleProgress, middleScale - challengeCamera.startScale, slopes[0], slopes[1]),
    second: segmentEasing(challengeMotion.holdProgress - challengeMotion.middleProgress, challengeCamera.endScale - middleScale, slopes[1], slopes[2]),
  };
}

export type ChallengeTile = {
  id: string;
  depth: ChallengeDepth;
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  underlay?: string;
  treatment?: "logo" | "building";
};

// Exact State 03 rectangles (409:3641–409:3649), including off-frame crops.
// Asset names preserve Figma Rectangle numbers where no descriptive name exists.
export const challengeTiles: readonly ChallengeTile[] = [
  { id: "62", depth: "far", x: 761.8604125976562, y: 178.73440551757812, width: 123.7092056274414, height: 113.40010833740234, src: "/assets/images/challenge-today/riso-logo.png", treatment: "logo" },
  { id: "63", depth: "middle", x: 984.0870361328125, y: -135.66522216796875, width: 242.2638702392578, height: 270.0984191894531, src: "/assets/images/challenge-today/riso-map.png" },
  { id: "68", depth: "middle", x: 582.504638671875, y: 869.891845703125, width: 242.2638702392578, height: 270.0984191894531, src: "/assets/images/challenge-today/riso-68.png" },
  { id: "66", depth: "near", x: 375.10394287109375, y: -283, width: 295.8711853027344, height: 329.89117431640625, src: "/assets/images/hero/riso-building.png", treatment: "building" },
  { id: "69", depth: "near", x: 1049.91748046875, y: 761.8450927734375, width: 295.8711853027344, height: 329.89117431640625, src: "/assets/images/challenge-today/riso-69.png" },
  { id: "64", depth: "near", x: -171.926640085876, y: -118.05534362792969, width: 293.8093566894531, height: 327.8293762207031, src: "/assets/images/challenge-today/riso-64.png" },
  // Paint the small background detail before the larger foreground machinery.
  // Keep this ordering independent of their scroll curves and geometry.
  { id: "70", depth: "far", x: 364.89935302734375, y: 666.3658447265625, width: 119.09517669677734, height: 136.28419494628906, src: "/assets/images/hero/riso-surveyor.png", underlay: "/assets/images/challenge-today/riso-67.png" },
  { id: "67", depth: "near", x: -104.49230194091797, y: 623.3905029296875, width: 297.9329833984375, height: 338.1384582519531, src: "/assets/images/challenge-today/riso-67.png" },
  { id: "65", depth: "near", x: 1411.348388671875, y: 159.2593994140625, width: 469.06414794921875, height: 523.7023315429688, src: "/assets/images/challenge-today/riso-65.png" },
];

const bounded = (value: number) => Math.max(0, Math.min(1, value));

export function getChallengeTileMotion(tile: ChallengeTile) {
  const { weights, roles, derivatives, sizeRange } = challengeMotion;
  const size = bounded((Math.sqrt(tile.width * tile.height) / challengeCamera.width - sizeRange[0]) / (sizeRange[1] - sizeRange[0]));
  const radius = Math.hypot(
    tile.x + tile.width / 2 - challengeCamera.originX,
    tile.y + tile.height / 2 - challengeCamera.originY,
  );
  const position = bounded(radius / (Math.hypot(challengeCamera.width, challengeCamera.height) / 2));
  const response = weights.role * roles[tile.depth] + weights.size * size + weights.position * position;
  const desktopSlopes = derivatives.far.map((slope, i) => slope + (derivatives.near[i] - slope) * response);
  const mobileSlopes = desktopSlopes.map((slope, i) => {
    const middle = derivatives.middle[i];
    return middle + (slope - middle) * challengeMotion.mobileDepthStrength;
  });
  const zoomMiddle = challengeMotion.zoomMiddleRange[0] +
    (challengeMotion.zoomMiddleRange[1] - challengeMotion.zoomMiddleRange[0]) * response;
  // Same normalized late curve, different distance: relative zoom speeds stay
  // separated throughout the second half, not just at the entrance. Sharing
  // this derivative with the first segment avoids a midpoint speed jump.
  const zoomSlopes = [desktopSlopes[0], -challengeMotion.zoomMiddleVelocity *
    (zoomMiddle - challengeCamera.endScale) / (challengeMotion.holdProgress - challengeMotion.middleProgress), 0];
  const zoomProfile = (strength: number) => {
    const middleScale = challengeCamera.middleScale + (zoomMiddle - challengeCamera.middleScale) * strength;
    const slopes = zoomSlopes.map((slope, i) => derivatives.middle[i] + (slope - derivatives.middle[i]) * strength);
    return { middleScale, slopes, ...depthEasing(slopes, middleScale) };
  };
  return {
    response, size, position, radius,
    slopes: { desktop: desktopSlopes, mobile: mobileSlopes },
    desktop: depthEasing(desktopSlopes),
    mobile: depthEasing(mobileSlopes),
    zoom: { desktop: zoomProfile(1), mobile: zoomProfile(challengeMotion.mobileDepthStrength) },
  };
}

// Static server calculations only. Position already participates in radial
// travel through the common Figma pivot. Center travel and centered image zoom
// use separate transforms; no per-frame calculations or 3D rendering required.
// Opening/final Figma geometry stays exact; intermediate image sizes now differ.
export const challengeTileMotion = Object.fromEntries(
  challengeTiles.map((tile) => [tile.id, getChallengeTileMotion(tile)]),
);
