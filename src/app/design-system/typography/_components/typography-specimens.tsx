"use client";

import { useEffect, useRef, useState } from "react";
import type { TextStyle } from "../../_data/foundation";

type Measurement = { size: string; lineHeight: string; tracking: string };

// Manual inspection aid only. Samples render with real global utilities;
// this component reads their styles, never calculates or sets their sizes.
export function TypographySpecimens({ styles }: { styles: TextStyle[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [measurements, setMeasurements] = useState<Record<string, Measurement>>({});
  const [viewport, setViewport] = useState<number | null>(null);

  useEffect(() => {
    let frame = 0;
    let disposed = false;
    const format = (value: string) => value === "normal" ? "0px" : `${Number.parseFloat(value).toFixed(2)}px`;

    function measure() {
      if (!rootRef.current || disposed) return;
      const next: Record<string, Measurement> = {};
      rootRef.current.querySelectorAll<HTMLElement>("[data-type-sample]").forEach((sample) => {
        const key = sample.dataset.typeSample;
        if (!key) return;
        const computed = getComputedStyle(sample);
        next[key] = {
          size: format(computed.fontSize),
          lineHeight: format(computed.lineHeight),
          tracking: format(computed.letterSpacing),
        };
      });
      setMeasurements(next);
      setViewport(window.innerWidth);
    }

    function schedule() {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }

    schedule();
    window.addEventListener("resize", schedule);
    void document.fonts.ready.then(schedule);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div ref={rootRef} className="flex min-w-0 flex-col gap-4">
      <p className="min-h-5 text-sm text-text-secondary tabular-nums">
        Viewport: {viewport === null ? "—" : `${viewport}px`}. Values below are read from rendered CSS.
      </p>
      <noscript>Samples still scale without JavaScript. Enable JavaScript for the computed-value readout.</noscript>
      {styles.map((style) => {
        const measured = measurements[style.className];
        return (
          <article key={style.className} className="min-w-0 rounded-card border border-border-default bg-background-primary p-4">
            <h3 className="text-sm font-medium text-text-primary">{style.figma}</h3>
            <code className="mt-1 block break-all text-xs text-text-secondary">{style.className}</code>
            <p data-type-sample={style.className} className={`${style.className} my-6 text-text-primary`}>
              {style.family === "crimson" ? "The future of loss control is here." : "Turning Loss Control into a competitive edge."}
            </p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs leading-5 text-text-secondary tabular-nums">
              <div><dt>Current size</dt><dd className="text-text-primary">{measured?.size ?? "—"}</dd></div>
              <div><dt>Scaling</dt><dd className="text-text-primary">{style.scaling}</dd></div>
              <div><dt>Minimum</dt><dd>{style.minSize}px</dd></div>
              <div><dt>Desktop maximum</dt><dd>{style.size}px</dd></div>
              <div><dt>Line height</dt><dd>{style.lineHeight}% · {measured?.lineHeight ?? "—"}</dd></div>
              <div><dt>Letter spacing</dt><dd>{style.letterSpacing}% · {measured?.tracking ?? "—"}</dd></div>
            </dl>
          </article>
        );
      })}
    </div>
  );
}
