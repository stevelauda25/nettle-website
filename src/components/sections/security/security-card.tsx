import Image from "next/image";
import type { ReactNode } from "react";

type SecurityCardProps = {
  id: string;
  title: string;
  children: ReactNode;
  visual: ReactNode;
  textureClassName?: string;
};

export function SecurityCard({ id, title, children, visual, textureClassName = "" }: SecurityCardProps) {
  return (
    // Figma's unbound #0F0F0F fill is documented in the foundation review.
    <li className="relative isolate min-w-0 overflow-hidden rounded-lg bg-[#0f0f0f]" data-slot="security-card">
      <Image
        src="/assets/images/features/card-texture.png"
        alt=""
        fill
        sizes="(min-width: 1440px) 370px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className={`pointer-events-none -z-10 object-cover opacity-5 ${textureClassName}`}
      />
      <article aria-labelledby={id} className="flex h-full min-h-[400px] flex-col md:min-h-[460px]">
        {visual}
        <div className="mt-auto flex flex-col gap-2.5 p-(--space-card-padding)" data-slot="security-card-content">
          <h3 id={id} className="text-body-large-medium text-white">{title}</h3>
          <p className="text-body-medium-regular text-white/60">{children}</p>
        </div>
      </article>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/5 ring-inset" />
    </li>
  );
}
