"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { StageFrame } from "../harnesses/stage-frame";
import type { Fit } from "../harnesses/fitted-stage";
import type { Selection } from "../registry";
import { ORIGINAL_ID } from "../registry";
import { isStageMessage, postToStage, type FrameId, type StageCommand, type StageStatus } from "../stage/channel";
import type { CompareMode } from "./toolbar";
import { viewportById, type ViewportId } from "./viewports";
import styles from "./lab.module.css";

type PreviewPaneProps = {
  selection: Selection;
  viewport: ViewportId;
  compare: CompareMode;
  reduced: boolean;
  grid: boolean;
  reloadKey: number;
  onStatus: (status: StageStatus | null) => void;
  /** Lets the toolbar send transport commands to every visible stage. */
  registerSender: (send: (command: StageCommand) => void) => void;
};

/**
 * Center pane: the production part at a real viewport size. In "Side by side"
 * two stages share the viewport, transport and scroll position, so Original
 * and Motion are always seen under equivalent conditions.
 */
export function PreviewPane({ selection, viewport, compare, reduced, grid, reloadKey, onStatus, registerSender }: PreviewPaneProps) {
  const preset = viewportById(viewport);
  const windows = useRef<Partial<Record<FrameId, Window | null>>>({});
  const expectedScroll = useRef<Partial<Record<FrameId, number>>>({});
  const [fits, setFits] = useState<Partial<Record<FrameId, Fit>>>({});
  const [sizes, setSizes] = useState<Partial<Record<FrameId, { width: number; height: number }>>>({});

  const entryId = selection.concept?.id ?? ORIGINAL_ID;
  const side = compare === "side";

  const onWindow = useCallback((frame: FrameId, target: Window | null) => {
    windows.current[frame] = target;
  }, []);

  const send = useCallback((command: StageCommand) => {
    for (const frame of ["a", "b"] as const) postToStage(windows.current[frame], frame, command);
  }, []);

  useEffect(() => registerSender(send), [registerSender, send]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || !isStageMessage(event.data) || event.data.type !== "status") return;
      const status = event.data;
      setSizes((current) =>
        current[status.frame]?.width === status.viewportWidth && current[status.frame]?.height === status.viewportHeight
          ? current
          : { ...current, [status.frame]: { width: status.viewportWidth, height: status.viewportHeight } },
      );
      if (status.frame === "a") onStatus(status);

      // Keep the two stages scrolled together, without echoing forever.
      if (side) {
        const other: FrameId = status.frame === "a" ? "b" : "a";
        const expected = expectedScroll.current[status.frame];
        if (expected !== undefined && Math.abs(expected - status.scrollTop) <= 1) return;
        expectedScroll.current[other] = status.scrollTop;
        postToStage(windows.current[other], other, { type: "scrollTo", top: status.scrollTop });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onStatus, side]);

  const onFit = useCallback((frame: FrameId, fit: Fit) => {
    setFits((current) => (current[frame]?.scale === fit.scale ? current : { ...current, [frame]: fit }));
  }, []);

  const describe = (frame: FrameId) => {
    const size = sizes[frame];
    const fit = fits[frame];
    const dims = size ? `${size.width} × ${size.height}` : preset.width ? `${preset.width} × ${preset.height}` : "…";
    const shown = fit && fit.scale < 1 ? ` · shown at ${Math.round(fit.scale * 100)}%` : preset.width ? " · actual size" : "";
    return `${preset.label} · ${dims}${shown}`;
  };

  const frames: { frame: FrameId; motion: boolean; label: string }[] = side
    ? [
        { frame: "a", motion: false, label: "Original" },
        { frame: "b", motion: true, label: selection.concept ? selection.concept.title : "Motion (same as Original)" },
      ]
    : [{ frame: "a", motion: compare === "motion", label: compare === "motion" ? "Motion" : "Original" }];

  return (
    <section className={styles.preview} data-side={side ? "" : undefined} aria-label="Live preview">
      {frames.map(({ frame, motion, label }) => (
        <div key={frame} className={styles.stageCell}>
          <div className={styles.stageLabel}>
            <span>{label}</span>
            <span className={styles.stageDims}>{describe(frame)}</span>
          </div>
          <div className={styles.stageBox}>
            <StageFrame
              sectionId={selection.section.id}
              entryId={entryId}
              mode={{ motion, reduced, grid, frame }}
              width={preset.width}
              height={preset.height}
              reloadKey={reloadKey}
              onWindow={onWindow}
              onFit={onFit}
            />
          </div>
        </div>
      ))}
    </section>
  );
}
