/**
 * Motion spec — the single shape shared by the production wrapper
 * (MotionScope), the Motion Lab controls pane and, later, the DialKit adapter.
 *
 * The top-level keys are the designer's control groups, in the order the lab
 * shows them. Every tunable number is a tuple `[value, min, max, step]`, so a
 * value, its authoring range and its step travel together and can never drift
 * apart between the panel, a store and the stylesheet that consumes them.
 *
 * Nothing here is imported by a production section until a Concept is Live.
 */
import { springToLinear } from "./easing";

export type Tuple = readonly [value: number, min: number, max: number, step: number];

export const CONTROL_GROUPS = [
  "timing",
  "easing",
  "stagger",
  "opacity",
  "position",
  "scale",
  "rotation",
  "scroll",
] as const;

export type ControlGroup = (typeof CONTROL_GROUPS)[number];

/** Designer-facing labels. The code names above never appear in the lab UI. */
export const CONTROL_GROUP_LABELS: Record<ControlGroup, string> = {
  timing: "Timing",
  easing: "Easing",
  stagger: "Stagger",
  opacity: "Opacity",
  position: "Position",
  scale: "Scale",
  rotation: "Rotation",
  scroll: "Scroll behavior",
};

export type Easing =
  | { type: "curve"; value: string }
  | { type: "spring"; visualDuration: number; bounce: number };

/**
 * Which runtime turns the spec into movement. `css` is the only driver in the
 * foundation: the sheet reads the spec's CSS variables and the Web Animations
 * API provides play, pause and replay. A JavaScript or library-backed driver
 * plugs into the same seam when an approved Concept needs one.
 */
export type MotionDriver = "css";

export type MotionSpec = {
  driver: MotionDriver;
  timing?: { duration?: Tuple; delay?: Tuple };
  easing?: Easing;
  stagger?: { interval?: Tuple };
  opacity?: { from?: Tuple };
  position?: { x?: Tuple; y?: Tuple };
  scale?: { from?: Tuple };
  rotation?: { from?: Tuple };
  scroll?: { rangeStart?: Tuple; rangeEnd?: Tuple };
};

/** An Original entry: nothing to tune, nothing to animate. */
export const EMPTY_SPEC: MotionSpec = { driver: "css" };

/** The groups a spec actually declares, in display order. */
export function specGroups(spec: MotionSpec): ControlGroup[] {
  return CONTROL_GROUPS.filter((group) => spec[group] !== undefined);
}

const seconds = (tuple: Tuple) => `${tuple[0]}s`;
const px = (tuple: Tuple) => `${tuple[0]}px`;
const unitless = (tuple: Tuple) => String(tuple[0]);
const percent = (tuple: Tuple) => `${tuple[0]}%`;

/**
 * The CSS custom properties a motion sheet consumes. Written onto the
 * MotionScope element, inherited by every slot beneath it.
 */
export function specToCssVars(spec: MotionSpec): Record<`--m-${string}`, string> {
  const vars: Record<`--m-${string}`, string> = {};
  if (spec.timing?.duration) vars["--m-timing-duration"] = seconds(spec.timing.duration);
  if (spec.timing?.delay) vars["--m-timing-delay"] = seconds(spec.timing.delay);
  if (spec.easing) vars["--m-easing"] = easingToCss(spec.easing);
  if (spec.stagger?.interval) vars["--m-stagger-interval"] = seconds(spec.stagger.interval);
  if (spec.opacity?.from) vars["--m-opacity-from"] = unitless(spec.opacity.from);
  if (spec.position?.x) vars["--m-position-x"] = px(spec.position.x);
  if (spec.position?.y) vars["--m-position-y"] = px(spec.position.y);
  if (spec.scale?.from) vars["--m-scale-from"] = unitless(spec.scale.from);
  if (spec.rotation?.from) vars["--m-rotation-from"] = `${spec.rotation.from[0]}deg`;
  if (spec.scroll?.rangeStart) vars["--m-scroll-range-start"] = percent(spec.scroll.rangeStart);
  if (spec.scroll?.rangeEnd) vars["--m-scroll-range-end"] = percent(spec.scroll.rangeEnd);
  return vars;
}

export function easingToCss(easing: Easing): string {
  if (easing.type === "curve") return easing.value;
  return springToLinear(easing.visualDuration, easing.bounce).easing;
}
