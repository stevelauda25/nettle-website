import type { AnnotationAnchor, DocRect } from "@/review/types/review";

/**
 * Annotation anchoring (browser only).
 *
 * Save: find the smallest page element (outside the review UI) that contains
 * the selected rectangle, build a CSS selector for it, and store the rectangle
 * as fractions of that element's box. Document-relative fractions are always
 * stored too, as a fallback.
 *
 * Resolve: query the selector, read the element's current box and scale the
 * fractions back to document pixels. So annotations follow their element
 * across viewport sizes, layout shifts and scroll-linked transforms instead of
 * reusing stale page pixels.
 */

export const REVIEW_UI_ATTRIBUTE = "data-review-ui";

// Selected areas may overshoot their anchor element slightly.
const CONTAIN_TOLERANCE = 8;

export type ResolvedAnnotation = DocRect & {
  /** False when the anchor element was not found and the document fallback was used. */
  attached: boolean;
};

function documentSize() {
  const root = document.documentElement;
  return { width: Math.max(root.scrollWidth, 1), height: Math.max(root.scrollHeight, 1) };
}

export function toDocRect(element: Element): DocRect {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + window.scrollX, y: rect.top + window.scrollY, width: rect.width, height: rect.height };
}

function contains(outer: DocRect, inner: DocRect) {
  return (
    inner.x >= outer.x - CONTAIN_TOLERANCE &&
    inner.y >= outer.y - CONTAIN_TOLERANCE &&
    inner.x + inner.width <= outer.x + outer.width + CONTAIN_TOLERANCE &&
    inner.y + inner.height <= outer.y + outer.height + CONTAIN_TOLERANCE
  );
}

// React `useId` values and similar generated ids change between renders/builds.
function isStableId(id: string) {
  return !/[:«»]/.test(id) && !/^_?r_/.test(id) && !/^radix-/.test(id);
}

function isUnique(selector: string, element: Element) {
  const matches = document.querySelectorAll(selector);
  return matches.length === 1 && matches[0] === element;
}

/**
 * Selector from the nearest stable hook (id, section `aria-labelledby`, unique
 * `data-slot`) down to the element, using `:nth-of-type` where needed.
 */
export function buildSelector(element: Element): string | null {
  const parts: string[] = [];
  let node: Element | null = element;

  while (node && node !== document.body && node !== document.documentElement) {
    const tag = node.localName;

    if (node.id && isStableId(node.id)) {
      const selector = `#${CSS.escape(node.id)}`;
      if (isUnique(selector, node)) return [selector, ...parts].join(" > ");
    }

    for (const attribute of ["aria-labelledby", "data-slot"]) {
      const value = node.getAttribute(attribute);
      if (!value || (attribute === "aria-labelledby" && !isStableId(value))) continue;
      const selector = `${tag}[${attribute}="${CSS.escape(value)}"]`;
      if (isUnique(selector, node)) return [selector, ...parts].join(" > ");
    }

    const parent: Element | null = node.parentElement;
    let part = tag;
    if (parent) {
      const siblings = Array.from(parent.children).filter((child) => child.localName === tag);
      if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
    }
    parts.unshift(part);
    node = parent;
  }

  const selector = ["body", ...parts].join(" > ");
  return isUnique(selector, element) ? selector : null;
}

function isReviewUi(element: Element) {
  return element.closest(`[${REVIEW_UI_ATTRIBUTE}]`) !== null;
}

function findAnchorElement(rect: DocRect) {
  // Probe the centre of the visible part of the selection.
  const left = Math.max(rect.x, window.scrollX);
  const right = Math.min(rect.x + rect.width, window.scrollX + window.innerWidth);
  const top = Math.max(rect.y, window.scrollY);
  const bottom = Math.min(rect.y + rect.height, window.scrollY + window.innerHeight);
  const clientX = (left + right) / 2 - window.scrollX;
  const clientY = (top + bottom) / 2 - window.scrollY;

  let element: Element | null =
    document.elementsFromPoint(clientX, clientY).find((candidate) => !isReviewUi(candidate)) ?? null;

  while (element && element !== document.body && element !== document.documentElement) {
    const box = toDocRect(element);
    if (box.width > 0 && box.height > 0 && contains(box, rect)) {
      const selector = buildSelector(element);
      if (selector) return { selector, box };
    }
    element = element.parentElement;
  }
  return null;
}

export function createAnchor(rect: DocRect): AnnotationAnchor {
  const doc = documentSize();
  const fallback = {
    fallbackX: rect.x / doc.width,
    fallbackY: rect.y / doc.height,
    fallbackWidth: rect.width / doc.width,
    fallbackHeight: rect.height / doc.height,
  };
  const viewport = { viewportWidth: window.innerWidth, viewportHeight: window.innerHeight };
  const anchor = findAnchorElement(rect);

  if (!anchor) {
    return {
      anchorSelector: null,
      relativeX: fallback.fallbackX,
      relativeY: fallback.fallbackY,
      relativeWidth: fallback.fallbackWidth,
      relativeHeight: fallback.fallbackHeight,
      ...fallback,
      ...viewport,
    };
  }

  const { selector, box } = anchor;
  return {
    anchorSelector: selector,
    relativeX: (rect.x - box.x) / box.width,
    relativeY: (rect.y - box.y) / box.height,
    relativeWidth: rect.width / box.width,
    relativeHeight: rect.height / box.height,
    ...fallback,
    ...viewport,
  };
}

export function resolveAnchor(anchor: AnnotationAnchor): ResolvedAnnotation {
  if (anchor.anchorSelector) {
    let element: Element | null = null;
    try {
      element = document.querySelector(anchor.anchorSelector);
    } catch {
      element = null;
    }

    if (element && !isReviewUi(element)) {
      const box = toDocRect(element);
      if (box.width > 0 || box.height > 0) {
        return {
          x: box.x + anchor.relativeX * box.width,
          y: box.y + anchor.relativeY * box.height,
          width: anchor.relativeWidth * box.width,
          height: anchor.relativeHeight * box.height,
          attached: true,
        };
      }
    }
  }

  const doc = documentSize();
  return {
    x: anchor.fallbackX * doc.width,
    y: anchor.fallbackY * doc.height,
    width: anchor.fallbackWidth * doc.width,
    height: anchor.fallbackHeight * doc.height,
    attached: anchor.anchorSelector === null,
  };
}
