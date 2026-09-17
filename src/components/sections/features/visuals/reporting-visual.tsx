import Image from "next/image";
import { VisualHeader } from "./primitives";

const reports = [
  { company: "Riverside Manufacturing", image: "riverside-manufacturing", findings: "08", highRisk: true },
  { company: "Northstar Logistics", image: "northstar-logistics", findings: "05", highRisk: false },
  { company: "Pinecrest Builders", image: "pinecrest-builders", findings: "07", highRisk: false },
  { company: "Summit Retail Group", image: "summit-retail", findings: "07", highRisk: false },
] as const;

// Figma 409:3796. These are individual photos, not a flattened UI screenshot.
export function ReportingVisual() {
  return (
    <div data-slot="reporting-visual" className="relative size-full overflow-hidden rounded-tl-[10px] bg-white ring-[0.6px] ring-black/10">
      <VisualHeader icon="report.svg" title="Reports" />
      <div className="absolute top-16 left-4 w-96 overflow-hidden rounded bg-warm-gray-100 px-0.5 pb-0.5 ring-[0.5px] ring-black/10">
        <div className="py-1 pr-1.5 pl-2 text-[9px] leading-[1.2] font-medium text-warm-gray-900">Property list</div>
        <div className="rounded bg-white px-2 ring-[0.5px] ring-black/10">
          {reports.map((report) => (
            <div key={report.company} data-slot="feature-report-row" className="flex items-center gap-3 border-b-[0.5px] border-black/10 py-3 pr-1.5 last:border-b-0">
              <Image src={`/assets/images/features/${report.image}.png`} alt="" width={46} height={46} className="size-[46px] shrink-0 rounded object-cover ring-[0.5px] ring-black/10" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5 text-[12px] leading-[1.1]">
                <span className="font-medium text-warm-gray-950">{report.company}</span>
                <span className="text-warm-gray-900">Same day・{report.findings} findings</span>
              </div>
              {/* Figma uses unbound UI badge fills; keep them local to the illustration. */}
              <span className={`shrink-0 rounded px-2 py-1 text-[10px] leading-[1.2] ring-[0.5px] ring-black/15 ${report.highRisk ? "bg-[#ffebeb] text-[#ff0000]" : "bg-[#fef1ec] text-brand-500"}`}>
                {report.highRisk ? "High risk" : "Medium risk"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
