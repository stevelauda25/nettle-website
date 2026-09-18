/**
 * Shell ↔ stage channel. DEV ONLY.
 *
 * The shell and each stage are separate documents (the stage is an iframe at a
 * real viewport size). They talk through `postMessage` with these typed
 * messages and nothing else. Anything added later — a tuning store, DialKit,
 * an in-page dock — speaks this same protocol.
 *
 * Modes that change what the stage renders (motion on/off, forced reduced
 * motion, grid) are URL parameters, so a reload always reproduces the view.
 * Transport and status travel as messages.
 */
import type { PlaybackSnapshot } from "@/motion/drivers/css";

export const CHANNEL = "nettle-motion-lab";

/** Identifies which stage a message belongs to when two are shown side by side. */
export type FrameId = "a" | "b";

export type StageMode = {
  /** Render the entry's motion (true) or the Original (false). */
  motion: boolean;
  reduced: boolean;
  grid: boolean;
  frame: FrameId;
};

export type StageCommand =
  | { type: "play" }
  | { type: "pause" }
  | { type: "replay" }
  | { type: "reset" }
  | { type: "scrollTo"; top: number }
  | { type: "hello" };

export type StageStatus = {
  type: "status";
  entry: string;
  mode: StageMode;
  playback: PlaybackSnapshot;
  scrollTop: number;
  scrollHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  /** The OS preference inside the stage document. */
  osReduced: boolean;
};

/** A key pressed while the stage has focus, forwarded so shell shortcuts still work. */
export type StageKey = {
  type: "key";
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
};

export type StageMessage = { channel: typeof CHANNEL; frame: FrameId } & (StageCommand | StageStatus | StageKey);

export function isStageMessage(data: unknown): data is StageMessage {
  return !!data && typeof data === "object" && (data as { channel?: unknown }).channel === CHANNEL;
}

export function postToStage(target: Window | null | undefined, frame: FrameId, command: StageCommand) {
  target?.postMessage({ channel: CHANNEL, frame, ...command } satisfies StageMessage, window.location.origin);
}

export function postToShell(frame: FrameId, status: Omit<StageStatus, "type">) {
  if (window.parent === window) return;
  window.parent.postMessage({ channel: CHANNEL, frame, type: "status", ...status } satisfies StageMessage, window.location.origin);
}

export function postKeyToShell(frame: FrameId, event: KeyboardEvent) {
  if (window.parent === window) return;
  const { key, metaKey, ctrlKey, altKey, shiftKey } = event;
  window.parent.postMessage(
    { channel: CHANNEL, frame, type: "key", key, metaKey, ctrlKey, altKey, shiftKey } satisfies StageMessage,
    window.location.origin,
  );
}

export function stageUrl(sectionId: string, entryId: string, mode: StageMode) {
  const params = new URLSearchParams();
  params.set("motion", mode.motion ? "on" : "off");
  if (mode.reduced) params.set("reduced", "1");
  if (mode.grid) params.set("grid", "1");
  params.set("frame", mode.frame);
  return `/motion-lab/stage/${sectionId}/${entryId}?${params.toString()}`;
}

type SearchValue = string | string[] | undefined;

export function modeFromSearchParams(params: Record<string, SearchValue>): StageMode {
  const first = (value: SearchValue) => (Array.isArray(value) ? value[0] : value);
  return {
    motion: first(params.motion) !== "off",
    reduced: first(params.reduced) === "1",
    grid: first(params.grid) === "1",
    frame: first(params.frame) === "b" ? "b" : "a",
  };
}
