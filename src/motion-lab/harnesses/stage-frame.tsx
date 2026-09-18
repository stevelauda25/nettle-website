"use client";

import { useEffect, useRef, useState } from "react";
import { stageUrl, type FrameId, type StageMode } from "../stage/channel";
import { FittedStage, type Fit } from "./fitted-stage";
import styles from "./harnesses.module.css";

type StageFrameProps = {
  sectionId: string;
  entryId: string;
  mode: StageMode;
  width: number | null;
  height: number | null;
  /** Bumping this reloads the stage from its real starting position. */
  reloadKey: number;
  /** Hands the shell the stage window so it can post commands. */
  onWindow: (frame: FrameId, target: Window | null) => void;
  onFit?: (frame: FrameId, fit: Fit) => void;
};

/**
 * One preview: a same-origin iframe at the logical viewport, fitted to the
 * pane. Inside it the real section sees a real window, so `100vw`, `rem`,
 * container queries, `svh` and scroll timelines all resolve as on the homepage.
 */
export function StageFrame({ sectionId, entryId, mode, width, height, reloadKey, onWindow, onFit }: StageFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const src = stageUrl(sectionId, entryId, mode);

  useEffect(() => {
    onWindow(mode.frame, iframeRef.current?.contentWindow ?? null);
    return () => onWindow(mode.frame, null);
  }, [mode.frame, onWindow, reloadKey, src]);

  return (
    <FittedStage width={width} height={height} onFit={(fit) => onFit?.(mode.frame, fit)}>
      <iframe
        key={`${reloadKey}:${src}`}
        ref={iframeRef}
        className={styles.iframe}
        data-loaded={loaded ? "" : undefined}
        src={src}
        title={`${sectionId} ${entryId} preview ${mode.frame}`}
        onLoad={() => {
          setLoaded(true);
          onWindow(mode.frame, iframeRef.current?.contentWindow ?? null);
        }}
      />
    </FittedStage>
  );
}
