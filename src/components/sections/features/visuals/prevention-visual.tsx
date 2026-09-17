import Image from "next/image";
import { ProgressRing, VisualHeader } from "./primitives";

const imagePath = "/assets/images/features";

// Figma 409:3903, 416 × 347; deliberately clipped by its card.
type Recommendation = {
  image: string;
  title: string;
  company: string;
  status: "In Progress" | "Completed" | "Open";
};

const recommendations: Recommendation[] = [
  {
    image: "fire-door-maintenance.png",
    title: "Fire door maintenance",
    company: "Riverside Manufacturing",
    status: "In Progress",
  },
  {
    image: "sprinkler-inspection.png",
    title: "Update sprinkler inspection",
    company: "Northstar Logistics",
    status: "Completed",
  },
  {
    image: "loading-dock-barrier.png",
    title: "Repair loading dock barier",
    company: "Pinecrest Builders",
    status: "Open",
  },
];

function RecommendationStatus({ status }: { status: Recommendation["status"] }) {
  const styles = {
    "In Progress": "bg-[#fff8f5] text-brand-500",
    Completed: "bg-[#ebffeb] text-[green]",
    Open: "bg-warm-gray-100 text-warm-gray-800",
  }[status];

  return <span className={`shrink-0 rounded px-2 py-1 text-[10px] leading-[1.2] ring-[0.5px] ring-black/15 ${styles}`}>{status}</span>;
}

export function PreventionVisual() {
  return (
    <div data-slot="prevention-visual" className="relative h-full w-full overflow-hidden rounded-tl-[10px] bg-white ring-[0.6px] ring-black/10">
      <VisualHeader icon="hourglass.svg" title="Prevention tracker" />

      <div className="absolute top-[66px] left-4 w-96 overflow-hidden rounded bg-warm-gray-100 px-0.5 pb-0.5 ring-[0.5px] ring-black/10">
        <div className="px-2 py-1 text-[9px] leading-[1.2] font-medium text-warm-gray-900">Prevention Activity</div>
        <div className="flex items-center gap-3 rounded-[2px] bg-white px-3 py-2.5 ring-[0.5px] ring-black/10">
          <ProgressRing value="74%" variant="prevention" />
          <div className="flex w-[294px] shrink-0 flex-col gap-1 text-[11px] leading-[1.2]">
            <span className="font-medium text-warm-gray-900">74% of actions closed on time</span>
            <span className="text-warm-gray-800">Keeping sites safer through timely prevention.</span>
          </div>
        </div>
      </div>

      <div className="absolute top-[155px] left-4 w-96 overflow-hidden rounded bg-warm-gray-100 px-0.5 pb-0.5 ring-[0.5px] ring-black/10">
        <div className="px-2 py-1 text-[9px] leading-[1.2] font-medium text-warm-gray-900">Recent Recommendations</div>
        <div className="rounded bg-white px-2 ring-[0.5px] ring-black/10">
          {recommendations.map((recommendation, index) => (
            <div
              key={recommendation.title}
              className={`flex items-center gap-3 py-3 pr-1 ${index < recommendations.length - 1 ? "border-b-[0.5px] border-black/10" : ""}`}
            >
              <Image
                src={`${imagePath}/${recommendation.image}`}
                alt=""
                width={46}
                height={46}
                // This approved PNG stalls the local WebP optimizer; serve it intact.
                unoptimized={recommendation.image === "fire-door-maintenance.png"}
                className="size-[46px] shrink-0 rounded object-cover ring-[0.5px] ring-black/10"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5 text-[11px] leading-[1.1]">
                <span className="font-medium text-warm-gray-950">{recommendation.title}</span>
                <span className="text-warm-gray-900">{recommendation.company}</span>
              </div>
              <RecommendationStatus status={recommendation.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
