import { dashboardIcon } from "./data";
import { DashboardIcon } from "./primitives";
import type { StatCardData } from "./types";

export function StatCard({ title, icon, value, delta }: StatCardData) {
  return (
    <div
      data-slot="stat-card"
      className="flex min-w-px flex-1 flex-col overflow-hidden rounded-md bg-warm-gray-100 px-0.5 pt-0.5 ring-[0.5px] ring-black/10"
    >
      <div className="flex h-24 flex-col justify-between overflow-hidden rounded-sm bg-white py-2.5 pr-2 pl-2.5 ring-[0.5px] ring-black/10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] leading-[1.2] whitespace-nowrap text-warm-gray-900">{title}</span>
          <DashboardIcon src={icon} size={12} />
        </div>
        <div className="flex items-end gap-2">
          <span data-slot="stat-value" className="text-[24px] leading-[1.1] text-warm-gray-900">
            {value}
          </span>
          <span data-slot="stat-delta" className="pb-0.5 text-[11px] leading-[1.2] whitespace-nowrap text-warm-gray-800">
            {delta}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between py-1 pr-2 pl-2.5">
        <span className="text-[8px] leading-[1.2] text-warm-gray-800">View Details</span>
        <DashboardIcon src={dashboardIcon("card-chevron-right")} size={10} />
      </div>
    </div>
  );
}

export function StatCardGroup({ cards }: { cards: StatCardData[] }) {
  return (
    <div data-slot="stat-cards" className="flex gap-3">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
