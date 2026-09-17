import { DashboardBadge, DashboardCheckbox, DashboardIcon } from "@/components/visuals/product-dashboard";
import { VisualHeader } from "./primitives";

const surveys = [
  { account: "Caldwell Aerospace", location: "Seattle, WA", score: "91", icon: "rocket", tone: "critical" },
  { account: "Bridgeport Energy Solutions", location: "Houston, TX", score: "74", icon: "lightning", tone: "high" },
  { account: "Summit Health Partners", location: "Denver, CO", score: "63", icon: "building", tone: "high" },
  { account: "Lakeview Construction Group", location: "Milwaukee, WI", score: "45", icon: "building", tone: "neutral" },
  { account: "Northgate Financial Services", location: "Charlotte, NC", score: "82", icon: "bank", tone: "high" },
] as const;

// Figma 409:3730. Fixed illustration coordinates preserve the approved UI crop.
export function PrioritisationVisual() {
  return (
    <div data-slot="prioritisation-visual" className="relative size-full overflow-hidden rounded-tl-[10px] bg-white ring-[0.6px] ring-black/10">
      <VisualHeader icon="certificate.svg" title="Priority Surveys" largeLink />
      <div className="absolute top-[66px] left-4 w-96 text-[10px] leading-[1.1]">
        <div className="flex items-center gap-2.5 border-b-[0.5px] border-black/10 py-3 pr-1 text-warm-gray-800">
          <div className="shrink-0"><DashboardCheckbox /></div>
          <span className="w-[172px] shrink-0">Account</span>
          <span className="w-[112px] shrink-0">Location</span>
          <span className="w-[52px] shrink-0">Risk Score</span>
        </div>
        {surveys.map((survey) => (
          <div key={survey.account} data-slot="priority-survey-row" className="flex items-center gap-2.5 border-b-[0.5px] border-black/10 py-4 pr-1 text-warm-gray-900">
            <div className="shrink-0"><DashboardCheckbox /></div>
            <span className="flex w-[172px] shrink-0 items-center gap-1.5">
              <DashboardIcon src={`/assets/icons/features/${survey.icon}.svg`} size={14} />
              <span className="min-w-0 flex-1">{survey.account}</span>
            </span>
            <span className="w-[112px] shrink-0 leading-[1.4]">{survey.location}</span>
            <span className={`flex w-[52px] shrink-0 ${survey.tone === "critical" ? "[&>[data-slot=badge]]:px-1.5" : ""}`}>
              <DashboardBadge tone={survey.tone}>{survey.score}</DashboardBadge>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
