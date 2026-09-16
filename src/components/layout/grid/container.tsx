import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * The shared content box every standard section aligns to.
 *
 * Viewport → Section (full-bleed background, optional) → Container → Grid → content.
 *
 * Reads the same --grid-margin / --grid-max-width tokens as <GridOverlay>, so
 * the overlay always shares this exact box — never a separate full-width sibling.
 */
export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`relative mx-auto w-full max-w-[calc(var(--grid-max-width)+2*var(--grid-margin))] px-[var(--grid-margin)] ${className}`}>
      {children}
    </div>
  );
}
