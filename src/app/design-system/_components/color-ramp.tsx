import type { ReactNode } from "react";
import { ColorSwatch, type ColorSwatchValue } from "./color-swatch";

type ColorRampProps = {
  id: string;
  title: string;
  colors: readonly ColorSwatchValue[];
  description?: ReactNode;
};

export function ColorRamp({ id, title, colors, description }: ColorRampProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="flex w-full flex-col gap-2.5">
      <div className="flex flex-col gap-1 px-3">
        <h2 id={`${id}-heading`} className="text-sm leading-5 font-medium tracking-[0] text-text-primary">
          {title}
        </h2>
        {description ? (
          <div className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">{description}</div>
        ) : null}
      </div>

      <div className="grid w-full grid-cols-[repeat(4,138.5px)] gap-2.5">
        {colors.map((color) => (
          <ColorSwatch key={color.name} {...color} />
        ))}
      </div>
    </section>
  );
}
