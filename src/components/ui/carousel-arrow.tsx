import Image from "next/image";
import type { ButtonHTMLAttributes } from "react";

type CarouselArrowProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  direction: "previous" | "next";
  "aria-label": string;
  "aria-controls": string;
};

// Native action button, separate from the link-based CTA Button.
// Mobile has a real 44px target; desktop retains the approved 42px visual.
export function CarouselArrow({ direction, disabled, className = "", ...props }: CarouselArrowProps) {
  return (
    <button
      {...props}
      type="button"
      disabled={disabled}
      className={`relative flex size-11 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded bg-warm-gray-200 ring-1 ring-black/10 before:absolute before:-inset-px focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-default disabled:bg-warm-gray-50 md:size-[42px] ${className}`}
    >
      <Image
        src={`/assets/icons/features/arrow-${disabled ? "left" : "right"}.svg`}
        alt=""
        width={24}
        height={24}
        className={direction === "previous" ? "rotate-180" : ""}
      />
    </button>
  );
}
