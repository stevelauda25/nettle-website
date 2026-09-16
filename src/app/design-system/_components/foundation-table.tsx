import type { ReactNode } from "react";

export type FoundationTableColumn = {
  label: ReactNode;
  width: number;
};

export type FoundationTableCell = {
  content: ReactNode;
  mono?: boolean;
  secondary?: boolean;
};

type FoundationTableProps = {
  columns: readonly FoundationTableColumn[];
  rows: readonly (readonly (FoundationTableCell | ReactNode)[])[];
  rowHeights?: readonly number[];
  className?: string;
};

function cellValue(cell: FoundationTableCell | ReactNode): FoundationTableCell {
  if (typeof cell === "object" && cell !== null && !Array.isArray(cell) && "content" in cell) {
    return cell as FoundationTableCell;
  }
  return { content: cell };
}

export function FoundationTable({ columns, rows, rowHeights, className = "" }: FoundationTableProps) {
  const template = columns.map((column) => `${column.width}px`).join(" ");

  return (
    <div className={`relative w-full overflow-hidden rounded-card bg-background-primary shadow-card ${className}`}>
      <div className="grid bg-background-subtle" style={{ gridTemplateColumns: template }}>
        {columns.map((column, index) => (
          <div
            key={index}
            className={`flex h-[34px] items-center border-b-[0.5px] border-border-default px-3 py-2 text-xs leading-[18px] font-normal tracking-[0] text-text-secondary ${
              index < columns.length - 1 ? "border-r-[0.5px] border-border-default" : ""
            }`}
          >
            {column.label}
          </div>
        ))}
      </div>

      {rows.map((row, rowIndex) => {
        const height = rowHeights?.[rowIndex] ?? 34;
        return (
          <div key={rowIndex} className="grid" style={{ gridTemplateColumns: template }}>
            {row.map((rawCell, cellIndex) => {
              const cell = cellValue(rawCell);
              const lastRow = rowIndex === rows.length - 1;
              return (
                <div
                  key={cellIndex}
                  className={`flex items-center px-3 py-2 text-xs leading-[18px] font-normal tracking-[0] ${
                    cell.mono ? "font-mono" : ""
                  } ${cell.secondary ? "text-text-secondary" : "text-text-primary"} ${
                    cellIndex < columns.length - 1 ? "border-r-[0.5px] border-border-default" : ""
                  } ${!lastRow ? "border-b-[0.5px] border-border-default" : ""}`}
                  style={{ minHeight: height }}
                >
                  {cell.content}
                </div>
              );
            })}
          </div>
        );
      })}

      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] border-[0.5px] border-border-default" />
    </div>
  );
}
