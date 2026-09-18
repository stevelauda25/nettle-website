export type CarouselAvailability = { previous: boolean; next: boolean };

/** Native scrolling preserves touch, snapping and the existing track geometry.
 * Storyboard: click → adjacent target → smooth browser easing → snap/settle.
 * Retarget from the pending stop on repeated clicks, not an in-flight pixel.
 * Reduced motion skips the transition; direct input takes over immediately.
 */
export function createCarouselController(
  viewport: HTMLDivElement,
  cardSelector: string,
  onAvailability: (available: CarouselAvailability) => void,
) {
  let pending: number | null = null;
  let stops: number[] = [0];
  let available: CarouselAvailability | null = null;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function update() {
    const current = viewport.scrollLeft;
    if (pending !== null && Math.abs(current - pending) <= 1) pending = null;
    const position = pending ?? current;
    const next = { previous: position > 1, next: position < stops[stops.length - 1] - 1 };
    if (available?.previous !== next.previous || available?.next !== next.next) {
      available = next;
      onAvailability(next);
    }
  }

  function interrupt() {
    if (pending !== null) {
      pending = null;
      viewport.scrollTo({ left: viewport.scrollLeft, behavior: "instant" });
    }
    update();
  }

  function measure() {
    interrupt();
    const maximum = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const cards = Array.from(viewport.querySelectorAll(cardSelector));
    const firstLeft = cards[0]?.getBoundingClientRect().left ?? 0;
    // Clamp the last step to the existing track end (no extra trailing space).
    stops = [...new Set([0, ...cards.map((card) =>
      Math.min(maximum, Math.max(0, card.getBoundingClientRect().left - firstLeft)),
    ), maximum])];
    update();
  }

  function move(direction: -1 | 1) {
    const current = pending ?? viewport.scrollLeft;
    const target = direction === 1
      ? stops.find((stop) => stop > current + 1) ?? stops[stops.length - 1]
      : stops.findLast((stop) => stop < current - 1) ?? 0;
    if (target === current) return;
    pending = target;
    update();
    viewport.scrollTo({ left: target, behavior: reducedMotion.matches ? "instant" : "smooth" });
  }

  function onMotionChange() {
    if (reducedMotion.matches && pending !== null) {
      viewport.scrollTo({ left: pending, behavior: "instant" });
      update();
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (["Home", "End", "PageUp", "PageDown", " "].includes(event.key)) interrupt();
  }

  measure();
  viewport.addEventListener("scroll", update, { passive: true });
  viewport.addEventListener("pointerdown", interrupt, { passive: true });
  viewport.addEventListener("touchstart", interrupt, { passive: true });
  viewport.addEventListener("wheel", interrupt, { passive: true });
  viewport.addEventListener("keydown", onKeyDown);
  reducedMotion.addEventListener("change", onMotionChange);
  const observer = new ResizeObserver(measure);
  observer.observe(viewport);
  if (viewport.firstElementChild) observer.observe(viewport.firstElementChild);

  return {
    move,
    destroy() {
      viewport.removeEventListener("scroll", update);
      viewport.removeEventListener("pointerdown", interrupt);
      viewport.removeEventListener("touchstart", interrupt);
      viewport.removeEventListener("wheel", interrupt);
      viewport.removeEventListener("keydown", onKeyDown);
      reducedMotion.removeEventListener("change", onMotionChange);
      observer.disconnect();
      if (pending !== null) viewport.scrollTo({ left: viewport.scrollLeft, behavior: "instant" });
    },
  };
}
