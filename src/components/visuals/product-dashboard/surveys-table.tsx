import { dashboardIcon } from "./data";
import { DashboardBadge, DashboardCheckbox, DashboardIcon } from "./primitives";
import type { SurveyRowData, TableColumn } from "./types";

export function SurveyTableRow({ row }: { row: SurveyRowData }) {
  return (
    <tr data-slot="survey-row" className="border-b-[0.5px] border-black/10 last:border-b-0">
      <td className="py-3 pr-2 align-middle">
        <DashboardCheckbox />
      </td>
      <td className="py-3 pr-2">
        <span className="flex items-center gap-2">
          <DashboardIcon src={row.icon} size={14} />
          {row.account}
        </span>
      </td>
      <td className="py-3 pr-2">{row.lineOfBusiness}</td>
      <td className="py-3 pr-2">
        <DashboardBadge tone={row.risk.tone}>{row.risk.score}</DashboardBadge>
      </td>
      <td className="py-3 pr-2">
        <DashboardBadge tone={row.status.tone}>{row.status.label}</DashboardBadge>
      </td>
      <td className="py-3 pr-2">{row.location}</td>
      <td className="py-3">{row.date}</td>
    </tr>
  );
}

type SurveysTableProps = {
  title: string;
  columns: TableColumn[];
  rows: SurveyRowData[];
};

export function SurveysTable({ title, columns, rows }: SurveysTableProps) {
  const isLast = (i: number) => i === columns.length - 1;

  return (
    <div data-slot="surveys-table" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] leading-[1.2] font-medium text-warm-gray-900">{title}</span>
        <span className="flex items-center gap-0.5 text-[11px] leading-[1.2] text-warm-gray-800">
          View All
          <DashboardIcon src={dashboardIcon("chevron-right")} size={12} />
        </span>
      </div>

      <table className="w-full table-fixed border-collapse text-left text-[10px] leading-[1.1]">
        <colgroup>
          <col className="w-[21px]" />
          {columns.map((column, i) => (
            <col key={column.label} style={{ width: column.width + (isLast(i) ? 0 : 8) }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b-[0.5px] border-black/10 text-warm-gray-800">
            <th className="py-2 pr-2 align-middle font-normal">
              <DashboardCheckbox />
            </th>
            {columns.map((column, i) => (
              <th key={column.label} className={`py-2 font-normal ${isLast(i) ? "" : "pr-2"}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-warm-gray-900">
          {rows.map((row) => (
            <SurveyTableRow key={row.account} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
