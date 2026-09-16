"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IconMask } from "./icon-mask";

export type OnThisPageItem = {
  label: string;
  href: `#${string}`;
  nested?: boolean;
};

type OnThisPageProps = {
  items: readonly OnThisPageItem[];
};

type AnchorSelection = {
  targetScrollTop: number;
  arrived: boolean;
};

function sectionId(href: string) {
  return href.slice(1);
}

const indicatorSpring =
  "linear(0, 0.064, 0.238, 0.46, 0.674, 0.841, 0.949, 1.007, 1.028, 1.026, 1.017, 1.008, 1.002, 1)";

export function OnThisPage({ items }: OnThisPageProps) {
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "");
  const anchorSelectionRef = useRef<AnchorSelection | null>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const rowRefs = useRef(new Map<OnThisPageItem["href"], HTMLAnchorElement>());

  useLayoutEffect(() => {
    const indicator = indicatorRef.current;
    const activeRow = rowRefs.current.get(activeHref);

    if (!indicator || !activeRow) return;

    const updateIndicatorGeometry = () => {
      indicator.style.height = `${activeRow.offsetHeight}px`;
      indicator.style.transform = `translate3d(0, ${activeRow.offsetTop}px, 0)`;
    };

    updateIndicatorGeometry();

    const resizeObserver = new ResizeObserver(updateIndicatorGeometry);
    if (navRef.current) resizeObserver.observe(navRef.current);
    rowRefs.current.forEach((row) => resizeObserver.observe(row));

    return () => resizeObserver.disconnect();
  }, [activeHref, items]);

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>("main");
    if (!scrollContainer || items.length === 0) return;

    const sections = items.map((item) => ({
      href: item.href,
      element: document.getElementById(sectionId(item.href)),
    }));

    const updateActiveSection = () => {
      const anchorSelection = anchorSelectionRef.current;

      if (anchorSelection) {
        const isAtAnchor = Math.abs(scrollContainer.scrollTop - anchorSelection.targetScrollTop) <= 1;
        if (!anchorSelection.arrived) {
          anchorSelection.arrived = isAtAnchor;
          return;
        }
        if (isAtAnchor) return;
        anchorSelectionRef.current = null;
      }

      const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      if (maxScrollTop - scrollContainer.scrollTop <= 1) {
        setActiveHref(items[items.length - 1].href);
        return;
      }

      const activationLine = scrollContainer.getBoundingClientRect().top + scrollContainer.clientHeight / 3;
      let currentHref = items[0].href;

      for (const section of sections) {
        if (!section.element) continue;
        if (section.element.getBoundingClientRect().top <= activationLine) {
          currentHref = section.href;
        } else {
          break;
        }
      }

      setActiveHref(currentHref);
    };

    updateActiveSection();
    scrollContainer.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", updateActiveSection);
  }, [items]);

  const selectAnchor = (href: OnThisPageItem["href"]) => {
    const scrollContainer = document.querySelector<HTMLElement>("main");
    const target = document.getElementById(sectionId(href));

    if (scrollContainer && target) {
      const scrollOffset = Number.parseFloat(getComputedStyle(scrollContainer).scrollPaddingTop);
      const targetScrollTop = Math.min(
        scrollContainer.scrollHeight - scrollContainer.clientHeight,
        Math.max(
          0,
          scrollContainer.scrollTop +
            target.getBoundingClientRect().top -
            scrollContainer.getBoundingClientRect().top -
            scrollOffset,
        ),
      );

      anchorSelectionRef.current = {
        targetScrollTop,
        arrived: Math.abs(scrollContainer.scrollTop - targetScrollTop) <= 1,
      };
    }

    setActiveHref(href);
  };

  return (
    <div className="flex h-full w-full flex-col gap-0.5 py-[54px]">
      <div className="flex h-8 w-full shrink-0 items-center gap-0.5 py-1.5">
        <IconMask src="/assets/icons/navigation/on-this-page.svg" className="size-3.5 text-text-tertiary" />
        <p className="min-w-0 flex-1 text-sm leading-5 font-normal tracking-[0] text-text-tertiary">On this page</p>
      </div>

      <nav ref={navRef} aria-label="On this page" className="relative flex w-full flex-col">
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-px bg-border-default" />
        <span
          ref={indicatorRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 h-8 w-px bg-border-focus transition-[transform] duration-[480ms] motion-reduce:transition-none"
          style={{ transitionTimingFunction: indicatorSpring }}
        />
        {items.map((item) => {
          const active = activeHref === item.href;
          return (
            <a
              key={item.href}
              ref={(row) => {
                if (row) rowRefs.current.set(item.href, row);
                else rowRefs.current.delete(item.href);
              }}
              href={item.href}
              className={`relative flex min-h-8 w-full shrink-0 items-center py-1.5 text-sm leading-5 font-normal tracking-[0] hover:text-text-primary ${
                item.nested ? "px-6" : "px-4"
              } ${active ? "text-text-primary" : "text-text-secondary"}`}
              onClick={() => selectAnchor(item.href)}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
