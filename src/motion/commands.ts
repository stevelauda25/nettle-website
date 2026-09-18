/**
 * Transport commands a MotionScope understands.
 *
 * They travel as DOM events on the scope element, so the production wrapper
 * needs no knowledge of who is driving it (the Motion Lab stage today; nothing
 * in production dispatches them). The CSS driver handles play and pause with
 * the Web Animations API; replay and reset change the scope's state.
 */
export const MOTION_COMMAND_EVENT = "nettle-motion:command";

export type MotionCommand = "play" | "pause" | "replay" | "reset";

export type MotionCommandEvent = CustomEvent<MotionCommand>;

export function dispatchMotionCommand(target: Element, command: MotionCommand) {
  target.dispatchEvent(new CustomEvent<MotionCommand>(MOTION_COMMAND_EVENT, { detail: command }));
}
