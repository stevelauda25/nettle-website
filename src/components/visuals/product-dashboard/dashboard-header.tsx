import { dashboardIcon } from "./data";
import { DashboardIcon } from "./primitives";

type DashboardHeaderProps = {
  greeting: string;
  actionLabel: string;
};

export function DashboardHeader({ greeting, actionLabel }: DashboardHeaderProps) {
  return (
    <div data-slot="dashboard-header" className="flex items-center justify-between px-6 py-3">
      <span className="font-heading text-[20px] leading-none font-light tracking-[-0.01em] whitespace-nowrap text-black">
        {greeting}
      </span>
      <span
        data-slot="dashboard-action"
        className="flex items-center gap-1 rounded-[5px] border-[0.5px] border-black/10 bg-brand-500 py-1 pr-1.5 pl-1 text-[9px] leading-[1.1] text-white"
      >
        <DashboardIcon src={dashboardIcon("plus")} size={13} />
        {actionLabel}
      </span>
    </div>
  );
}
