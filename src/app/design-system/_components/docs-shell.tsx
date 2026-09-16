import type { ReactNode } from "react";
import { DocsBrand } from "./docs-brand";
import { DocsHeader } from "./docs-header";
import { DocsSidebar } from "./docs-sidebar";

type DocsShellProps = {
  children: ReactNode;
  pageTitle?: string;
  activePath?: string;
  breadcrumb?: {
    parent: string;
    current: string;
  };
  detailRail?: ReactNode;
  smoothAnchorScroll?: boolean;
};

export function DocsShell({
  children,
  pageTitle = "Home",
  activePath = "/design-system",
  breadcrumb,
  detailRail,
  smoothAnchorScroll = false,
}: DocsShellProps) {
  const isDetailPage = Boolean(detailRail);

  return (
    <div className="grid h-dvh min-h-0 min-w-[1440px] grid-cols-[300px_minmax(1140px,1fr)] grid-rows-[64px_minmax(0,1fr)] overflow-hidden bg-background-primary">
      <DocsBrand />
      <DocsHeader title={pageTitle} breadcrumb={breadcrumb} />
      <DocsSidebar activePath={activePath} />
      <main
        className={`col-start-2 row-start-2 min-h-0 overflow-x-hidden overflow-y-auto ${
          smoothAnchorScroll ? "scroll-smooth scroll-pt-7" : ""
        } ${isDetailPage ? "" : "py-[58px] [scrollbar-gutter:stable_both-edges]"}`}
      >
        {isDetailPage ? (
          <div className="grid h-max min-h-full w-[1140px] grid-cols-[840px_300px]">
            <div className="h-max min-h-full self-start px-32 py-[58px]">
              <div className="flex w-[584px] flex-col gap-12">{children}</div>
            </div>
            <aside className="sticky top-0 h-[calc(100dvh-64px)] min-h-0 self-start overflow-hidden">
              {detailRail}
            </aside>
          </div>
        ) : (
          <div className="mx-auto flex w-[680px] flex-col gap-12">{children}</div>
        )}
      </main>
    </div>
  );
}
