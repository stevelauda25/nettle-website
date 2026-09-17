import Image from "next/image";

const iconPath = "/assets/icons/features";

// Product illustration text and unbound progress colors match Figma, not site typography.
export function VisualHeader({ icon, title, largeLink = false }: { icon: string; title: string; largeLink?: boolean }) {
  return (
    <div className="absolute top-4 right-4 left-4 flex items-center gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="relative flex size-[30px] items-center justify-center shrink-0 overflow-hidden rounded-sm bg-warm-gray-50 ring-[0.6px] ring-black/15">
          <Image src={`${iconPath}/${icon}`} alt="" width={18} height={18} className="size-[18px]" />
        </span>
        <span className="min-w-0 flex-1 text-[12px] leading-[1.2] font-medium text-warm-gray-950">{title}</span>
      </div>
      <span className={`flex shrink-0 items-center gap-1.5 leading-[1.2] text-warm-gray-800 ${largeLink ? "text-[12px]" : "text-[10px]"}`}>
        View All
        <Image src={`${iconPath}/chevron-right.svg`} alt="" width={14} height={14} />
      </span>
    </div>
  );
}

export function ProgressRing({ value, variant }: { value: string; variant: "confidence" | "prevention" }) {
  const progress = variant === "confidence" ? "confidence-progress.svg" : "prevention-progress.svg";

  return (
    <div className="relative size-9 shrink-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 bottom-[16.31%]">
        <Image src={`${iconPath}/progress-track.svg`} alt="" fill sizes="36px" />
      </div>
      <div className={`absolute top-0 bottom-[16.31%] left-0 ${variant === "prevention" ? "right-[16.31%]" : "right-0"}`}>
        <Image src={`${iconPath}/${progress}`} alt="" fill sizes="36px" />
      </div>
      <span className="absolute top-[calc(50%-6px)] left-1/2 -translate-x-1/2 text-[9px] leading-[1.2] font-medium text-[#e59761]">
        {value}
      </span>
    </div>
  );
}
