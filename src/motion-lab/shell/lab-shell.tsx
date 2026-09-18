"use client";

import { useCallback, useRef, useState } from "react";
import { useReducedMotion } from "@/motion/hooks/use-reduced-motion";
import { ORIGINAL_ID, type Selection } from "../registry";
import { stageUrl, type StageCommand, type StageStatus } from "../stage/channel";
import type { SectionMeta } from "../types";
import { AdvancedDrawer } from "./advanced-drawer";
import { ControlsPane } from "./controls-pane";
import { PreviewPane } from "./preview-pane";
import { SectionNav } from "./section-nav";
import { StorylinePanel } from "./storyline-panel";
import { ShortcutsDialog } from "./shortcuts-dialog";
import type { ShortcutAction } from "./shortcuts";
import { Toolbar, type CompareMode } from "./toolbar";
import { usePersisted } from "./use-persisted";
import { useShortcuts } from "./use-shortcuts";
import { VIEWPORT_IDS, type ViewportId } from "./viewports";
import styles from "./lab.module.css";

type LabShellProps = {
  sections: readonly SectionMeta[];
  selection: Selection | null;
};

const COMPARE_MODES: readonly CompareMode[] = ["motion", "original", "side"];

/**
 * The Motion Lab workspace. DEV ONLY.
 *
 * Owns the view state (viewport, compare, reduced motion, grid) and the
 * transport, and composes the four panes. Everything it shows comes from the
 * registry's metadata and the stage's status messages.
 */
export function LabShell({ sections, selection }: LabShellProps) {
  const [viewport, setViewport] = usePersisted<ViewportId>("nettle-motion-lab.viewport", "desktop", VIEWPORT_IDS);
  const [compare, setCompare] = usePersisted<CompareMode>("nettle-motion-lab.compare", "motion", COMPARE_MODES);
  const [reduced, setReduced] = useState(false);
  const [grid, setGrid] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [status, setStatus] = useState<StageStatus | null>(null);
  const osReduced = useReducedMotion();

  const sender = useRef<((command: StageCommand) => void) | null>(null);
  const registerSender = useCallback((send: (command: StageCommand) => void) => {
    sender.current = send;
  }, []);

  const onTransport = useCallback((command: "play" | "pause" | "replay" | "reset") => {
    sender.current?.({ type: command });
  }, []);

  const onStatus = useCallback((next: StageStatus | null) => setStatus(next), []);

  // One path for compare changes: the segmented control and the "C" key both use it.
  const changeCompare = useCallback(
    (mode: CompareMode) => {
      setCompare(mode);
      setReloadKey((key) => key + 1);
    },
    [setCompare],
  );

  const [helpOpen, setHelpOpen] = useState(false);
  const hasSelection = selection !== null;
  const playing = status?.playback.playState === "running";

  const onShortcut = useCallback(
    (action: ShortcutAction) => {
      if (action.type === "toggleHelp") {
        setHelpOpen((open) => !open);
        return;
      }
      if (helpOpen && action.type === "reset") {
        setHelpOpen(false);
        return;
      }
      if (!hasSelection) return;
      switch (action.type) {
        case "togglePlay":
          onTransport(playing ? "pause" : "play");
          break;
        case "replay":
          onTransport("replay");
          break;
        case "reset":
          onTransport("reset");
          break;
        case "viewport":
          setViewport(action.id);
          break;
        case "cycleCompare":
          changeCompare(COMPARE_MODES[(COMPARE_MODES.indexOf(compare) + 1) % COMPARE_MODES.length]);
          break;
        case "toggleGrid":
          setGrid((on) => !on);
          break;
      }
    },
    [changeCompare, compare, hasSelection, helpOpen, onTransport, playing, setViewport],
  );
  useShortcuts(onShortcut);

  const entryId = selection?.concept?.id ?? ORIGINAL_ID;
  const stageHref = selection
    ? stageUrl(selection.section.id, entryId, { motion: compare !== "original", reduced, grid, frame: "a" })
    : null;

  return (
    <div className={styles.lab}>
      <SectionNav sections={sections} selectedSectionId={selection?.section.id ?? null} selectedEntryId={selection ? entryId : null} />

      <Toolbar
        selection={selection}
        viewport={viewport}
        onViewport={setViewport}
        compare={compare}
        onCompare={changeCompare}
        reduced={reduced}
        onReduced={setReduced}
        grid={grid}
        onGrid={setGrid}
        osReduced={osReduced}
        status={status}
        onTransport={onTransport}
        stageHref={stageHref}
        onHelp={() => setHelpOpen((open) => !open)}
      />
      <ShortcutsDialog open={helpOpen} onClose={() => setHelpOpen(false)} />

      <main className={styles.main}>
        {selection ? (
          <PreviewPane
            selection={selection}
            viewport={viewport}
            compare={compare}
            reduced={reduced}
            grid={grid}
            reloadKey={reloadKey}
            onStatus={onStatus}
            registerSender={registerSender}
          />
        ) : (
          <section className={styles.welcome} aria-label="Start">
            <h1>Nettle Motion Lab</h1>
            <p>Pick a homepage section on the left. Each one opens on its Original, the production part exactly as the site renders it.</p>
            <p>
              Concepts are added per section after their storyline is approved. This workspace previews them at real viewport sizes,
              compares them with the Original, and will hold their controls.
            </p>
          </section>
        )}
        <div className={styles.below}>
          <StorylinePanel selection={selection} />
          <AdvancedDrawer selection={selection} stageHref={stageHref} />
        </div>
      </main>

      <ControlsPane selection={selection} />
    </div>
  );
}
