"use client";

import { OWNER_LABELS, type Selection } from "../registry";
import type { StageStatus } from "../stage/channel";
import { VIEWPORTS, type ViewportId } from "./viewports";
import { ConceptStateChip } from "./state-chips";
import styles from "./lab.module.css";

export type CompareMode = "motion" | "original" | "side";

type ToolbarProps = {
  selection: Selection | null;
  viewport: ViewportId;
  onViewport: (id: ViewportId) => void;
  compare: CompareMode;
  onCompare: (mode: CompareMode) => void;
  reduced: boolean;
  onReduced: (on: boolean) => void;
  grid: boolean;
  onGrid: (on: boolean) => void;
  osReduced: boolean;
  status: StageStatus | null;
  onTransport: (command: "play" | "pause" | "replay" | "reset") => void;
  stageHref: string | null;
  onHelp: () => void;
};

function formatSeconds(ms: number | null) {
  return ms === null ? "–" : `${(ms / 1000).toFixed(2)} s`;
}

/**
 * Where am I, what state is it in, how am I looking at it.
 */
export function Toolbar({
  selection,
  viewport,
  onViewport,
  compare,
  onCompare,
  reduced,
  onReduced,
  grid,
  onGrid,
  osReduced,
  status,
  onTransport,
  stageHref,
  onHelp,
}: ToolbarProps) {
  const playback = status?.playback ?? null;
  const hasMotion = !!playback && playback.animations > 0;
  const noSelection = selection === null;

  return (
    <header className={styles.toolbar}>
      <div className={styles.toolbarRow}>
        <div className={styles.where}>
          {selection ? (
            <>
              <span className={styles.crumb}>{selection.section.title}</span>
              <span className={styles.crumbSep} aria-hidden="true">›</span>
              <span className={styles.crumbCurrent}>{selection.concept ? selection.concept.title : "Original"}</span>
              <ConceptStateChip state={selection.concept ? selection.concept.state : "original"} />
              <span className={styles.productionLine}>
                {selection.concept
                  ? `${OWNER_LABELS[selection.concept.owner]} · ${
                      selection.concept.visual ? "key visual workspace" : "Concept"
                    }${selection.concept.state === "storyline" ? " · at rest until its storyline is approved" : ""}`
                  : "In production now: no motion"}
              </span>
            </>
          ) : (
            <span className={styles.crumbCurrent}>Choose a section</span>
          )}
        </div>
        <div className={styles.toolbarAside}>
          {stageHref && (
            <a className={styles.textButton} href={stageHref} target="_blank" rel="noreferrer">
              Open preview in a new tab ↗
            </a>
          )}
          <button type="button" className={styles.helpButton} onClick={onHelp} aria-label="Keyboard shortcuts" title="Keyboard shortcuts (?)">
            ?
          </button>
        </div>
      </div>

      <div className={styles.toolbarRow}>
        <div className={styles.group} role="group" aria-label="Viewport">
          {VIEWPORTS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={styles.segment}
              aria-pressed={viewport === preset.id}
              onClick={() => onViewport(preset.id)}
              disabled={noSelection}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className={styles.group} role="group" aria-label="Playback">
          <button type="button" className={styles.segment} onClick={() => onTransport("play")} disabled={noSelection} title="Play">▶</button>
          <button type="button" className={styles.segment} onClick={() => onTransport("pause")} disabled={noSelection} title="Pause">⏸</button>
          <button type="button" className={styles.segment} onClick={() => onTransport("replay")} disabled={noSelection}>Replay</button>
          <button type="button" className={styles.segment} onClick={() => onTransport("reset")} disabled={noSelection}>Reset</button>
          <span className={styles.readout} aria-live="polite">
            {noSelection
              ? ""
              : !status
                ? "connecting…"
                : hasMotion
                  ? `${playback.playState} · ${formatSeconds(playback.time)} / ${formatSeconds(playback.duration)}`
                  : "no motion in this view"}
          </span>
        </div>

        <div className={styles.group} role="group" aria-label="Compare">
          {(
            [
              ["motion", "Motion"],
              ["original", "Original"],
              ["side", "Side by side"],
            ] as const
          ).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              className={styles.segment}
              aria-pressed={compare === mode}
              onClick={() => onCompare(mode)}
              disabled={noSelection}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.group} role="group" aria-label="View options">
          <button type="button" className={styles.segment} aria-pressed={reduced} onClick={() => onReduced(!reduced)} disabled={noSelection}>
            Reduced motion
          </button>
          <button type="button" className={styles.segment} aria-pressed={grid} onClick={() => onGrid(!grid)} disabled={noSelection}>
            Grid
          </button>
          <span className={styles.readout} title="Your operating system setting">
            {osReduced ? "OS: reduce motion" : "OS: full motion"}
          </span>
        </div>
      </div>
    </header>
  );
}
