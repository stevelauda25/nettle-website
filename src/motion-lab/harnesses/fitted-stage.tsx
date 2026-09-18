"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import styles from "./harnesses.module.css";

export type Fit = { scale: number; availableWidth: number; availableHeight: number };

type FittedStageProps = {
  /** Logical size of the child. Null means fluid: fill the frame. */
  width: number | null;
  height: number | null;
  onFit?: (fit: Fit) => void;
  children: ReactNode;
};

/**
 * Separates a preview's LOGICAL size from its VISIBLE size.
 *
 * The child (an iframe) is laid out at its full logical size, so everything
 * inside it resolves against a real viewport, then the element is scaled with
 * a transform to fit the frame and the scaled footprint is reserved so nothing
 * overflows. The document inside the iframe is never transformed.
 */
export function FittedStage({ width, height, onFit, children }: FittedStageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState<{ width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => setAvailable({ width: frame.clientWidth, height: frame.clientHeight });
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    measure();
    return () => observer.disconnect();
  }, []);

  const fluid = width === null || height === null;
  const ready = available !== null && available.width > 0 && available.height > 0;
  const scale = fluid || !ready ? 1 : Math.min(1, available.width / width, available.height / height);

  const onFitRef = useRef(onFit);
  useLayoutEffect(() => {
    onFitRef.current = onFit;
  }, [onFit]);
  useLayoutEffect(() => {
    if (ready) onFitRef.current?.({ scale, availableWidth: available.width, availableHeight: available.height });
  }, [ready, scale, available]);

  if (fluid) {
    return (
      <div ref={frameRef} className={styles.frame}>
        <div className={styles.fluid}>{children}</div>
      </div>
    );
  }

  return (
    <div ref={frameRef} className={styles.frame}>
      <div className={styles.reserve} style={{ width: width * scale, height: height * scale }}>
        <div className={styles.canvas} style={{ width, height, transform: scale < 1 ? `scale(${scale})` : undefined }}>
          {children}
        </div>
      </div>
    </div>
  );
}
