import type { CSSProperties } from "react";

type IconMaskProps = {
  src: string;
  className?: string;
  flipped?: boolean;
};

export function IconMask({ src, className = "size-3.5", flipped = false }: IconMaskProps) {
  const maskStyles: CSSProperties = {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  };

  return (
    <span
      aria-hidden="true"
      className={`shrink-0 bg-current ${className} ${flipped ? "-scale-y-100" : ""}`}
      style={maskStyles}
    />
  );
}
