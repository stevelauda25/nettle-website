import type { CSSProperties, ReactNode } from "react";
import styles from "./scaled-canvas.module.css";

type ScaledCanvasProps = {
  /** Design size of the canvas in px; content lays out at this size. */
  width: number;
  height: number;
  /** Accessible description of the whole illustration. */
  label: string;
  className?: string;
  children: ReactNode;
};

/**
 * Renders fixed-size illustration content and scales it as one unit to the
 * available width (1:1 at the design width), without JS or a client component.
 * Children are hidden from assistive tech; `label` describes the picture.
 */
export function ScaledCanvas({ width, height, label, className = "", children }: ScaledCanvasProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`@container relative w-full overflow-hidden rounded-md ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        aria-hidden="true"
        data-slot="scaled-canvas"
        className={`absolute top-0 left-0 origin-top-left select-none ${styles.canvas}`}
        style={{ width, height, "--canvas-design-width": `${width}px` } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
