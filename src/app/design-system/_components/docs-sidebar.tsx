"use client";

import { useState } from "react";
import { NavigationItem } from "./navigation-item";

const foundationItems = [
  { label: "Color", href: "/design-system/color" },
  { label: "Typography", href: "/design-system/typography" },
  { label: "Spacing", href: "/design-system/spacing" },
  { label: "Grid", href: "/design-system/grid" },
  { label: "Border radius", href: "/design-system/radius" },
  { label: "Logo", href: "/design-system/logo" },
  { label: "Imagery", href: "/design-system/imagery" },
] as const;

let foundationsExpandedState = true;

type DocsSidebarProps = {
  activePath?: string;
};

export function DocsSidebar({ activePath = "/design-system" }: DocsSidebarProps) {
  const [foundationsExpanded, setFoundationsExpanded] = useState(foundationsExpandedState);
  const homeActive = activePath === "/design-system";

  function toggleFoundations() {
    setFoundationsExpanded((expanded) => {
      foundationsExpandedState = !expanded;
      return foundationsExpandedState;
    });
  }

  return (
    <aside className="col-start-1 row-start-2 p-5 shadow-[inset_-1px_0_0_var(--color-border-default)]">
      <nav aria-label="Documentation" className="flex flex-col gap-0.5">
        <NavigationItem
          label="Home"
          href="/design-system"
          icon={homeActive ? "/assets/icons/navigation/home.svg" : "/assets/icons/navigation/home-inactive.svg"}
          active={homeActive}
        />

        <div className="flex flex-col gap-0.5">
          <NavigationItem
            label="Foundations"
            icon="/assets/icons/navigation/foundations.svg"
            trailingIcon="/assets/icons/navigation/chevron.svg"
            expanded={foundationsExpanded}
            controls="foundations-navigation"
            onClick={toggleFoundations}
          />
          {foundationsExpanded ? (
            <div id="foundations-navigation" className="contents">
              {foundationItems.map((item) => (
                <NavigationItem key={item.href} {...item} active={activePath === item.href} nested />
              ))}
            </div>
          ) : null}
        </div>
      </nav>
    </aside>
  );
}
