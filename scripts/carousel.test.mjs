import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createCarouselController } from "../src/components/ui/carousel-controller.ts";

function setup(t, { positions = [0, 464, 928, 1392], maximum = 1100, reduce = false } = {}) {
  const media = new EventTarget();
  media.matches = reduce;
  let resize;
  let disconnected = false;
  const observed = [];
  const oldWindow = globalThis.window;
  const oldObserver = globalThis.ResizeObserver;
  globalThis.window = { matchMedia: () => media };
  globalThis.ResizeObserver = class {
    constructor(callback) { resize = callback; }
    observe(element) { observed.push(element); }
    disconnect() { disconnected = true; }
  };
  const viewport = new EventTarget();
  Object.assign(viewport, {
    scrollLeft: 0, clientWidth: 1000, scrollWidth: 1000 + maximum,
    firstElementChild: {}, calls: [],
    querySelectorAll: () => positions.map((left) => ({
      getBoundingClientRect: () => ({ left: left + 148 - viewport.scrollLeft }),
    })),
    scrollTo(options) {
      this.calls.push(options);
      if (options.behavior === "instant") this.scrollLeft = options.left;
    },
  });
  const updates = [];
  const controller = createCarouselController(viewport, "[data-card]", (value) => updates.push(value));
  t.after(() => {
    controller.destroy();
    globalThis.window = oldWindow;
    globalThis.ResizeObserver = oldObserver;
  });
  return {
    viewport, controller, media, updates, observed,
    resize: () => resize(), disconnected: () => disconnected,
    scroll(left) { viewport.scrollLeft = left; viewport.dispatchEvent(new Event("scroll")); },
  };
}

test("Next/Previous move one measured card at a time, with a clipped final step", (t) => {
  const { viewport, controller, scroll, updates } = setup(t);
  assert.deepEqual(updates.at(-1), { previous: false, next: true });
  for (const left of [464, 928, 1100]) {
    controller.move(1);
    assert.deepEqual(viewport.calls.at(-1), { left, behavior: "smooth" });
    scroll(left);
  }
  assert.deepEqual(updates.at(-1), { previous: true, next: false });
  for (const left of [928, 464, 0]) {
    controller.move(-1);
    assert.equal(viewport.calls.at(-1).left, left);
    scroll(left);
  }
  assert.deepEqual(updates.at(-1), { previous: false, next: true });
});

test("rapid clicks and reversal use the pending target, not intermediate pixels", (t) => {
  const { viewport, controller, scroll, updates } = setup(t);
  controller.move(1);
  scroll(100);
  controller.move(1);
  assert.equal(viewport.calls.at(-1).left, 928);
  controller.move(-1);
  assert.equal(viewport.calls.at(-1).left, 464);
  controller.move(-1);
  assert.equal(viewport.calls.at(-1).left, 0);
  assert.deepEqual(updates.at(-1), { previous: false, next: true });
});

test("native input interrupts animation and the next click starts from the swipe position", (t) => {
  const { viewport, controller, scroll } = setup(t);
  for (const event of ["pointerdown", "touchstart", "wheel"]) {
    controller.move(1);
    viewport.dispatchEvent(new Event(event));
    assert.equal(viewport.calls.at(-1).behavior, "instant");
    scroll(600);
    controller.move(-1);
    assert.equal(viewport.calls.at(-1).left, 464);
    scroll(464);
  }
});

test("reduced motion is instant and preference changes settle in-flight motion", (t) => {
  const { viewport, controller, media } = setup(t, { reduce: true });
  controller.move(1);
  assert.deepEqual(viewport.calls.at(-1), { left: 464, behavior: "instant" });
  media.matches = false;
  controller.move(1);
  assert.equal(viewport.calls.at(-1).behavior, "smooth");
  media.matches = true;
  media.dispatchEvent(new Event("change"));
  assert.deepEqual(viewport.calls.at(-1), { left: 928, behavior: "instant" });
});

test("resize recalculates fractional stops and clears stale destinations", (t) => {
  const positions = [0, 464, 928];
  const { viewport, controller, resize, observed } = setup(t, { positions });
  assert.equal(observed.length, 2);
  controller.move(1);
  positions[1] = 320.5;
  positions[2] = 641;
  viewport.scrollWidth = 1641;
  resize();
  controller.move(1);
  assert.equal(viewport.calls.at(-1).left, 320.5);
});

test("two-card testimonials use the same adjacent-step behavior and stop at the endpoint", (t) => {
  const { viewport, controller, updates } = setup(t, { positions: [0, 1176], maximum: 1176 });
  controller.move(1);
  assert.equal(viewport.calls.at(-1).left, 1176);
  assert.deepEqual(updates.at(-1), { previous: true, next: false });
  controller.move(1);
  assert.equal(viewport.calls.length, 1);
});

test("non-overflowing tracks do not move", (t) => {
  const { viewport, controller, updates } = setup(t, { maximum: 0 });
  controller.move(1);
  controller.move(-1);
  assert.equal(viewport.calls.length, 0);
  assert.deepEqual(updates, [{ previous: false, next: false }]);
});

test("scroll ticks do not publish repeated state; teardown removes subscriptions", (t) => {
  const { viewport, controller, scroll, media, disconnected, updates } = setup(t);
  controller.move(1);
  const count = updates.length;
  for (const left of [10, 20, 30, 40]) scroll(left);
  assert.equal(updates.length, count);
  controller.destroy();
  const calls = viewport.calls.length;
  viewport.dispatchEvent(new Event("wheel"));
  media.matches = true;
  media.dispatchEvent(new Event("change"));
  scroll(1100);
  assert.equal(viewport.calls.length, calls);
  assert.equal(updates.length, count);
  assert.equal(disconnected(), true);
});

test("all three wrappers share navigation, preserve keyboard guards and server children", () => {
  for (const path of ["features/features-carousel", "business-lines/business-line-carousel", "testimonial/testimonial-carousel"]) {
    const source = readFileSync(new URL(`../src/components/sections/${path}.tsx`, import.meta.url), "utf8");
    assert.match(source, /useCarousel\("\[data-slot='/);
    assert.match(source, /available=\{available\}/);
    assert.match(source, /event.target !== event.currentTarget/);
    assert.match(source, /<ul className=\{carouselStyles.track\}>\{children\}<\/ul>/);
    assert.doesNotMatch(source, /scrollTo|scrollBy|ResizeObserver/);
  }
});
