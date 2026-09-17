import Image from "next/image";
import { ProgressRing, VisualHeader } from "./primitives";

const iconPath = "/assets/icons/features";

// Figma 409:3843, 416 × 346.
function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="min-w-0 flex-1 overflow-hidden rounded-sm bg-warm-gray-100 px-0.5 pt-0.5 ring-[0.5px] ring-black/10">
      <div className="flex h-[76px] flex-col justify-between rounded-[2px] bg-white py-2 pr-1.5 pl-2 ring-[0.5px] ring-black/10">
        <div className="flex items-center justify-between text-[9px] leading-[1.2] text-warm-gray-900">
          <span>{label}</span>
          <Image src={`${iconPath}/${icon}`} alt="" width={12} height={12} />
        </div>
        <span className="text-[22px] leading-[1.1] text-warm-gray-900">{value}</span>
      </div>
      <div className="flex items-center justify-between py-[3px] pr-1.5 pl-2 text-[7px] leading-[1.2] text-warm-gray-800">
        <span>View Details</span>
        <Image src={`${iconPath}/chevron-small.svg`} alt="" width={10} height={10} />
      </div>
    </div>
  );
}

export function CoverageVisual() {
  return (
    <div data-slot="coverage-visual" className="relative h-full w-full overflow-hidden rounded-tl-[10px] bg-white ring-[0.6px] ring-black/10">
      <VisualHeader icon="compass.svg" title="Coverage overview" />

      <div className="absolute top-[66px] left-4 flex w-96 gap-2">
        <StatCard label="Self-survey" value="124" icon="file.svg" />
        <StatCard label="Agency-guided" value="86" icon="users.svg" />
      </div>

      <div className="absolute top-[172px] left-4 w-96 overflow-hidden rounded bg-warm-gray-100 px-0.5 pb-0.5 ring-[0.5px] ring-black/10">
        <div className="px-2 py-1 text-[9px] leading-[1.2] font-medium text-warm-gray-900">Confidence level</div>
        <div className="flex items-center gap-3 rounded-[2px] bg-white px-3 py-2.5 ring-[0.5px] ring-black/10">
          <ProgressRing value="87%" variant="confidence" />
          <div className="flex w-[294px] shrink-0 flex-col gap-1 text-[10px] leading-[1.2]">
            <span className="font-medium text-warm-gray-900">Renewal confidence</span>
            <span className="text-warm-gray-800">Better risk data. More profitable renewals.</span>
          </div>
        </div>
      </div>

      <div className="absolute top-[261px] left-4 flex w-96 flex-col text-[9px] leading-[1.1] text-warm-gray-800">
        <div className="flex items-center gap-2.5 border-b-[0.5px] border-black/10 py-3 pr-1">
          <span className="size-[13px] shrink-0 rounded-[2px] border-[0.5px] border-black/15 bg-white" />
          <span className="w-[152px] shrink-0">Property</span>
          <span className="w-[136px] shrink-0">Recommendation</span>
          <span className="w-[52px] shrink-0">Progress</span>
        </div>
        <div className="flex items-center gap-2.5 border-b-[0.5px] border-black/10 py-4 pr-1 text-warm-gray-900">
          <span className="size-[13px] shrink-0 rounded-[2px] border-[0.5px] border-black/15 bg-white" />
          <span className="flex w-[152px] shrink-0 items-center gap-2">
            <Image src={`${iconPath}/truck.svg`} alt="" width={14} height={14} />
            <span className="min-w-0">Northstar Logistics Center</span>
          </span>
          <span className="w-[136px] shrink-0 leading-[1.4]">Repair loading dock drainage</span>
          <span className="flex w-[52px] shrink-0 items-center">
            <span className="rounded bg-[#ebffeb] px-1 py-[3px] text-[9px] leading-[1.1] text-[green] ring-[0.5px] ring-black/15">98%</span>
          </span>
        </div>
      </div>
    </div>
  );
}
