/**
 * CSS driver.
 *
 * The foundation driver: movement is declared in a motion sheet, keyed off the
 * MotionScope's state attributes and CSS variables. Playback control comes from
 * the Web Animations API, which exposes every CSS animation and transition
 * beneath the scope, so the lab can play, pause and read progress without a
 * library. Scroll-driven animations report no time and are scrubbed by
 * scrolling; that is by design.
 */
import { dispatchMotionCommand, type MotionCommand } from "../commands";

export type PlayState = "none" | "idle" | "running" | "paused" | "finished";

export type PlaybackSnapshot = {
  animations: number;
  playState: PlayState;
  /** Milliseconds, or null when nothing is time-based. */
  time: number | null;
  /** Milliseconds, or null when nothing is time-based. */
  duration: number | null;
};

const asNumber = (value: CSSNumberish | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

function animationsOf(root: Element): Animation[] {
  return typeof root.getAnimations === "function" ? root.getAnimations({ subtree: true }) : [];
}

export const cssDriver = {
  id: "css" as const,

  run(root: Element, command: MotionCommand) {
    if (command === "play") for (const animation of animationsOf(root)) animation.play();
    else if (command === "pause") for (const animation of animationsOf(root)) animation.pause();
    else dispatchMotionCommand(root, command);
  },

  snapshot(root: Element): PlaybackSnapshot {
    const animations = animationsOf(root);
    if (animations.length === 0) return { animations: 0, playState: "none", time: null, duration: null };

    let time: number | null = null;
    let duration: number | null = null;
    for (const animation of animations) {
      const current = asNumber(animation.currentTime);
      if (current !== null) time = Math.max(time ?? 0, current);
      const end = asNumber(animation.effect?.getComputedTiming().endTime);
      if (end !== null) duration = Math.max(duration ?? 0, end);
    }

    const states = new Set(animations.map((animation) => animation.playState));
    const playState: PlayState = states.has("running")
      ? "running"
      : states.has("paused")
        ? "paused"
        : states.has("finished") && states.size === 1
          ? "finished"
          : "idle";

    return { animations: animations.length, playState, time, duration };
  },
};

export type MotionDriverRuntime = typeof cssDriver;
