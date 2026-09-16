import { BrowserToolbar } from "./browser-toolbar";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DASHBOARD_HEIGHT, DASHBOARD_WIDTH, defaultDashboardData } from "./data";
import { ScaledCanvas } from "./scaled-canvas";
import { StatCardGroup } from "./stat-cards";
import { SurveysTable } from "./surveys-table";
import type { DashboardData } from "./types";

type ProductDashboardProps = {
  /** Override any part of the Figma content. */
  data?: Partial<DashboardData>;
  label?: string;
  className?: string;
};

const defaultLabel =
  "Nettle dashboard showing assigned surveys, report and recommendation metrics, and a table of priority loss control surveys.";

/**
 * Figma: Hero › product-visual (388:5797). An illustrated Nettle workspace in a
 * browser window. Lays out at 1144×701 and scales with its container.
 *
 * Built from exported parts (BrowserToolbar, DashboardSidebar, DashboardHeader,
 * StatCardGroup, SurveysTable) with data-slot hooks on each, so animation can be
 * layered on per part later without restructuring.
 */
export function ProductDashboard({ data, label = defaultLabel, className = "" }: ProductDashboardProps) {
  const content = { ...defaultDashboardData, ...data };

  return (
    <ScaledCanvas width={DASHBOARD_WIDTH} height={DASHBOARD_HEIGHT} label={label} className={className}>
      <div data-slot="product-dashboard" className="relative size-full overflow-hidden rounded-md bg-white">
        <BrowserToolbar url={content.url} />

        <div className="absolute inset-x-0 top-[53px] bottom-0 flex">
          <DashboardSidebar teamName={content.teamName} items={content.sidebarItems} />

          <div data-slot="dashboard-main" className="flex min-w-0 flex-1 flex-col">
            <DashboardHeader greeting={content.greeting} actionLabel={content.primaryActionLabel} />

            <div className="flex flex-col gap-6 px-6 py-3">
              <StatCardGroup cards={content.statCards} />
              <SurveysTable title={content.tableTitle} columns={content.tableColumns} rows={content.surveyRows} />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-md shadow-[inset_0_0_0_1px_var(--color-black)] shadow-black/10" />
      </div>
    </ScaledCanvas>
  );
}
