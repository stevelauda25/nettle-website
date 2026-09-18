"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { MOTION_COMMAND_EVENT, type MotionCommandEvent } from "./commands";
import { useInView } from "./hooks/use-in-view";
import { useReducedMotion } from "./hooks/use-reduced-motion";
import { EMPTY_SPEC, specToCssVars, type MotionSpec } from "./spec";
import "./tokens.css";

export type MotionState = "off" | "idle" | "enter";

export type MotionScopeProps = {
  /** Section or visual name; becomes `data-motion` for the motion sheet. */
  name: string;
  /** Tunable values. Absent means the shipped defaults of the Live spec, or nothing. */
  spec?: MotionSpec;
  /** False renders the children exactly as production does with motion off. */
  enabled?: boolean;
  /** Treat the visitor as preferring reduced motion regardless of the OS. */
  forceReduced?: boolean;
  /** The motion sheet's scope class, when a Concept has one. */
  className?: string;
  children: ReactNode;
};

const subscribeNothing = () => () => {};

/**
 * The one client boundary production motion needs.
 *
 * Renders a `display: contents` wrapper, so it changes no layout, and passes
 * its server-rendered children through untouched. It owns four things: whether
 * the parent is in view, the reduced-motion state, the transport state, and the
 * spec's CSS variables. Motion sheets key off its data attributes:
 *
 *   [data-motion="hero"][data-motion-state="enter"] [data-slot="stat-card"] { … }
 *
 * Markup is identical on the server and the first client render; every
 * attribute that depends on the browser is added after hydration, so a visitor
 * without JavaScript sees the resting layout.
 */
export function MotionScope({
  name,
  spec = EMPTY_SPEC,
  enabled = true,
  forceReduced = false,
  className,
  children,
}: MotionScopeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const osReduced = useReducedMotion();
  const reduced = forceReduced || osReduced;
  const inView = useInView(ref, { parent: true, rootMargin: "-10% 0px" });
  // `armed` is the transport's contribution: reset disarms, replay re-arms.
  const [armed, setArmed] = useState(true);

  const state: MotionState = !enabled ? "off" : inView && armed ? "enter" : "idle";

  const onCommand = useCallback((event: Event) => {
    const command = (event as MotionCommandEvent).detail;
    if (command === "reset") setArmed(false);
    if (command === "play") setArmed(true);
    if (command === "replay") {
      setArmed(false);
      // Two frames: let the idle state paint so the sheet's animations restart.
      requestAnimationFrame(() => requestAnimationFrame(() => setArmed(true)));
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.addEventListener(MOTION_COMMAND_EVENT, onCommand);
    return () => element.removeEventListener(MOTION_COMMAND_EVENT, onCommand);
  }, [onCommand]);

  const style: CSSProperties = { display: "contents", ...specToCssVars(spec) };

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      data-motion={name}
      data-motion-driver={spec.driver}
      data-motion-state={state}
      data-motion-ready={ready ? "" : undefined}
      data-motion-reduced={reduced ? "" : undefined}
    >
      {children}
    </div>
  );
}
