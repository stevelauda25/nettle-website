/**
 * Keyboard shortcuts for the Motion Lab shell. DEV ONLY.
 *
 * One definition drives both the key handler and the "?" reference, so the
 * two can never disagree. Single keys fire only without Cmd/Ctrl/Alt, so the
 * browser's own Cmd+R, Cmd+C, Cmd+G, Cmd+1–4 and Cmd+Z are never intercepted.
 * Undo/Redo are reserved for the tuning system and are listed, not bound.
 */
import type { ViewportId } from "./viewports";

export type ShortcutAction =
  | { type: "togglePlay" }
  | { type: "replay" }
  | { type: "reset" }
  | { type: "viewport"; id: ViewportId }
  | { type: "cycleCompare" }
  | { type: "toggleGrid" }
  | { type: "toggleHelp" };

export type KeyLike = { key: string; metaKey: boolean; ctrlKey: boolean; altKey: boolean; shiftKey: boolean };

const VIEWPORT_KEYS: Record<string, ViewportId> = { "1": "desktop", "2": "tablet", "3": "mobile", "4": "fluid" };

/** The action a key press maps to, or null when the browser should keep it. */
export function actionForKey(event: KeyLike): ShortcutAction | null {
  if (event.metaKey || event.ctrlKey || event.altKey) return null;
  const key = event.key;
  // "?" arrives as key "?" on most layouts, or as "/" with Shift on others.
  if (key === "?" || (key === "/" && event.shiftKey)) return { type: "toggleHelp" };
  if (event.shiftKey) return null;
  switch (key) {
    case " ":
      return { type: "togglePlay" };
    case "r":
    case "R":
      return { type: "replay" };
    case "Escape":
      return { type: "reset" };
    case "c":
    case "C":
      return { type: "cycleCompare" };
    case "g":
    case "G":
      return { type: "toggleGrid" };
    default:
      return key in VIEWPORT_KEYS ? { type: "viewport", id: VIEWPORT_KEYS[key] } : null;
  }
}

/** Typing targets, plus anything a tuning panel marks with data-tuning-control. */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target.closest("input, textarea, select, [contenteditable=''], [contenteditable='true'], [data-tuning-control]")) return true;
  return false;
}

export type ShortcutGroup = {
  title: string;
  future?: boolean;
  items: { keys: string[]; label: string }[];
};

export const SHORTCUT_GROUPS: readonly ShortcutGroup[] = [
  {
    title: "Playback",
    items: [
      { keys: ["Space"], label: "Play / Pause" },
      { keys: ["R"], label: "Replay" },
      { keys: ["Esc"], label: "Reset" },
    ],
  },
  {
    title: "Viewport",
    items: [
      { keys: ["1"], label: "Desktop" },
      { keys: ["2"], label: "Tablet" },
      { keys: ["3"], label: "Mobile" },
      { keys: ["4"], label: "Fluid" },
    ],
  },
  {
    title: "View",
    items: [
      { keys: ["C"], label: "Compare: Motion → Original → Side by side" },
      { keys: ["G"], label: "Grid" },
      { keys: ["?"], label: "This reference" },
    ],
  },
  {
    title: "Coming with tuning",
    future: true,
    items: [
      { keys: ["⌘ / Ctrl", "Z"], label: "Undo last motion change" },
      { keys: ["⌘ / Ctrl", "⇧", "Z"], label: "Redo" },
    ],
  },
];
