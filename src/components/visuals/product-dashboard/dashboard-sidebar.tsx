import Image from "next/image";
import { dashboardIcon } from "./data";
import { DashboardIcon } from "./primitives";
import type { SidebarItem } from "./types";

type DashboardSidebarProps = {
  teamName: string;
  items: SidebarItem[];
};

export function DashboardSidebar({ teamName, items }: DashboardSidebarProps) {
  return (
    <div
      data-slot="dashboard-sidebar"
      className="flex h-full w-[223px] shrink-0 flex-col gap-px border-r-[0.5px] border-black/10 bg-[#fafafa]"
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          {/* Raw #002F87 team mark fill — unbound in Figma */}
          <span className="relative flex size-[21px] items-center justify-center overflow-hidden rounded-[3px] border-[0.5px] border-black/10 bg-[#002f87]">
            <span className="relative block h-[15.059px] w-[15.067px] -scale-y-100">
              <Image src={dashboardIcon("team-mark")} alt="" fill />
            </span>
          </span>
          <span className="flex items-center gap-0.5">
            <span className="text-[9px] leading-[1.4] font-medium text-warm-gray-950">{teamName}</span>
            <DashboardIcon src={dashboardIcon("chevron-down")} size={10} />
          </span>
        </div>
        <DashboardIcon src={dashboardIcon("flex-align-left")} size={12} />
      </div>

      <ul>
        {items.map((item) => (
          <li key={item.label} data-slot="sidebar-item" data-active={item.active || undefined} className="px-2.5 py-0.5">
            <span
              className={
                item.active
                  ? "flex items-center gap-1.5 rounded-[5px] border-[0.5px] border-black/10 bg-white py-1.5 pr-1.5 pl-[5px] text-warm-gray-950"
                  : "flex items-center gap-2 rounded-[5px] py-1.5 pr-1.5 pl-[5px] text-warm-gray-800"
              }
            >
              <DashboardIcon src={item.icon} size={13} />
              <span className="text-[9px] leading-[1.1]">{item.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
