"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cssDriver } from "@/motion/drivers/css";
import { useReducedMotion } from "@/motion/hooks/use-reduced-motion";
import { isStageMessage, postKeyToShell, postToShell, type StageMode } from "./channel";

type StageRootProps = {
  entry: string;
  mode: StageMode;
  children: ReactNode;
};

const STATUS_INTERVAL_MS = 250;

/**
 * The stage document's client shell. DEV ONLY.
 *
 * Listens for shell commands, forwards transport to the MotionScope beneath it
 * through the CSS driver, and reports playback and scroll position back.
 * Nothing here touches the production children; they render as on the homepage.
 */
export function StageRoot({ entry, mode, children }: StageRootProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const osReduced = useReducedMotion();
  const osReducedRef = useRef(osReduced);
  useEffect(() => {
    osReducedRef.current = osReduced;
  }, [osReduced]);

  useEffect(() => {
    const scope = () => rootRef.current?.querySelector<HTMLElement>("[data-motion]") ?? null;

    const report = () => {
      const element = scope();
      postToShell(mode.frame, {
        entry,
        mode,
        playback: element ? cssDriver.snapshot(element) : { animations: 0, playState: "none", time: null, duration: null },
        scrollTop: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        osReduced: osReducedRef.current,
      });
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || !isStageMessage(event.data)) return;
      const message = event.data;
      if (message.frame !== mode.frame || message.type === "status" || message.type === "key") return;
      const element = scope();
      switch (message.type) {
        case "play":
        case "pause":
        case "replay":
        case "reset":
          if (element) cssDriver.run(element, message.type);
          break;
        case "scrollTo":
          if (Math.abs(window.scrollY - message.top) > 1) window.scrollTo({ top: message.top, behavior: "instant" });
          break;
        case "hello":
          break;
      }
      report();
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(report);
    };

    // Shell shortcuts keep working while the preview has focus. Modified keys
    // stay with the browser; Space must not scroll the stage while it drives playback.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      const target = event.target;
      if (target instanceof Element && target.closest("input, textarea, select, [contenteditable=''], [contenteditable='true']")) return;
      if (event.key === " " || event.key === "?") event.preventDefault();
      postKeyToShell(mode.frame, event);
    };

    window.addEventListener("message", onMessage);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") report();
    }, STATUS_INTERVAL_MS);
    report();

    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(interval);
      cancelAnimationFrame(frame);
    };
  }, [entry, mode]);

  return (
    <div ref={rootRef} data-motion-lab-stage={mode.frame}>
      {children}
    </div>
  );
}
