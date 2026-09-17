import Link from "next/link";
import { GRID_QA_ENABLED } from "./grid-qa";

type GridToggleProps = {
  /** Route the toggle links to, e.g. "/" or "/homepage". */
  pathname: string;
  /** Whether `?grid=true` is currently set. */
  active: boolean;
};

/**
 * Bottom-right switch that toggles `?grid=true` (the PageGridOverlay).
 * Internal QA tooling: rendered only when GRID_QA_ENABLED.
 * `data-grid-toggle` lets the Review Mode toolbar stack directly above it.
 */
export function GridToggle({ pathname, active }: GridToggleProps) {
  if (!GRID_QA_ENABLED) return null;

  return (
    <Link
      href={active ? pathname : `${pathname}?grid=true`}
      scroll={false}
      role="switch"
      aria-checked={active}
      data-grid-toggle=""
      className="fixed right-4 bottom-4 z-[70] flex items-center gap-2 rounded-full border border-black/10 bg-white/90 py-1 pr-1 pl-3 text-[12px] leading-none text-warm-gray-800 shadow-sm backdrop-blur-sm"
    >
      Grid
      <span
        aria-hidden="true"
        className={`relative h-4 w-7 rounded-full transition-colors ${active ? "bg-brand-500" : "bg-black/10"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-3 rounded-full bg-white shadow-sm transition-transform ${active ? "translate-x-3" : ""}`}
        />
      </span>
    </Link>
  );
}
