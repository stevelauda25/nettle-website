export { MotionScope, type MotionScopeProps, type MotionState } from "./motion-scope";
export { cssDriver, type PlaybackSnapshot, type PlayState } from "./drivers/css";
export { dispatchMotionCommand, MOTION_COMMAND_EVENT, type MotionCommand } from "./commands";
export { springToLinear, type LinearSpring } from "./easing";
export { useReducedMotion } from "./hooks/use-reduced-motion";
export {
  CONTROL_GROUP_LABELS,
  CONTROL_GROUPS,
  EMPTY_SPEC,
  specGroups,
  specToCssVars,
  type ControlGroup,
  type Easing,
  type MotionDriver,
  type MotionSpec,
  type Tuple,
} from "./spec";
