// Must match --grid-columns in globals.css (12). The CSS var drives layout;
// this array only drives how many numbered swatches the overlay renders.
const columnIndices = Array.from({ length: 12 });

type GridOverlayProps = {
  /** Render the overlay. Pass the result of reading the `?grid=true` search param. */
  visible: boolean;
  /** Show the baseline rows in addition to columns/margins. */
  baseline?: boolean;
};

/**
 * Development-only grid overlay.
 *
 * MUST be rendered inside the same <Container> as the content it's checking —
 * it reads the identical --grid-margin/--grid-columns/--grid-gutter tokens,
 * so its columns ARE the content's columns at every viewport width, not a
 * separately-drawn approximation. See globals.css for the token definitions.
 *
 * - pointer-events: none — never intercepts clicks
 * - hidden by default (visible=false renders nothing)
 * - stripped from production builds entirely, regardless of the query param
 */
export function GridOverlay({ visible, baseline = false }: GridOverlayProps) {
  if (!visible || process.env.NODE_ENV === "production") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-50"
      style={{ left: "var(--grid-margin)", right: "var(--grid-margin)" }}
    >
      {baseline && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(to bottom, rgba(244,83,15,0.28) 0 1px, transparent 1px calc(var(--grid-baseline) * 3))",
              "repeating-linear-gradient(to bottom, rgba(244,83,15,0.1) 0 1px, transparent 1px var(--grid-baseline))",
            ].join(", "),
          }}
        />
      )}
      <div
        className="absolute inset-0 grid grid-cols-[repeat(var(--grid-columns),minmax(0,1fr))] gap-x-[var(--grid-gutter)]"
      >
        {columnIndices.map((_, i) => (
          <div key={i} className="relative bg-brand-500/[0.03] ring-[0.5px] ring-inset ring-brand-500/20">
            <span className="absolute top-2 left-1/2 -translate-x-1/2 font-mono text-[10px] text-brand-500/50">
              {i + 1}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-[0.5px] bg-brand-500/30" />
      <div className="absolute inset-y-0 right-0 w-[0.5px] bg-brand-500/30" />
    </div>
  );
}
