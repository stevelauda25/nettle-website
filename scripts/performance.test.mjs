import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import { assetUrl, deliveryAssets, sharp } from "./generate-lossless-assets.mjs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Sticky header seals the viewport paint edge without changing flow or adding scroll JS", () => {
  const source = read("src/components/layout/site-header.tsx");
  const shell = source.match(/<header data-site-header="" className="([^"]+)"/);
  assert.ok(shell);
  assert.equal(shell[1], "sticky top-0 z-50 bg-warm-gray-950 shadow-[0_-1px_0_0_var(--color-warm-gray-950)]");
  assert.match(source, /<div className="bg-white py-2/);
  assert.doesNotMatch(source, /use client|addEventListener|requestAnimationFrame|onScroll|will-change|translateZ/);
});

test("Only SiteHeader pages get the dark canvas backing; body and overscroll rules stay intact", () => {
  const css = read("src/app/globals.css");
  const canvas = css.match(/html:has\(> body > header\[data-site-header\]\)\s*\{([^}]+)\}/);
  assert.ok(canvas);
  assert.equal(canvas[1].trim(), "background-color: var(--color-warm-gray-950);");
  assert.match(css, /html,\s*body\s*\{\s*overscroll-behavior: none;/);
  assert.match(css, /body\s*\{\s*font-family: var\(--font-body\);\s*background-color: var\(--color-warm-gray-100\);/);
  assert.match(read("src/app/design-system/_data/foundation.ts"), /Internal docs do not use this canvas exception/);
});

for (const name of deliveryAssets) {
  test(`${name}: smaller delivery with identical dimensions and decoded pixels`, async () => {
    const source = readFileSync(assetUrl(`${name}.png`));
    const delivery = readFileSync(assetUrl(`${name}.webp`));
    const before = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const after = await sharp(delivery).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.deepEqual(after.info, before.info);
    assert.ok(after.data.equals(before.data));
    assert.ok(delivery.length < source.length * 0.5);
  });
}

test("Canonical image URLs only replace verified identical exports", () => {
  const groups = [
    ["features/card-texture.png", "business-lines/card-texture.png", "challenge-today/state-1-background.png"],
    ["business-lines/property-riso.png", "testimonial/brotherhood-archive.png"],
    ["key-metrics/engraved-ink.png", "testimonial/engraved-texture.png"],
  ];
  for (const [canonical, ...duplicates] of groups) {
    for (const duplicate of duplicates) {
      assert.ok(readFileSync(assetUrl(canonical)).equals(readFileSync(assetUrl(duplicate))), duplicate);
    }
  }
  for (const path of ["business-lines/business-lines", "challenge-today/challenge-today"]) {
    assert.match(read(`src/components/sections/${path}.tsx`), /src="\/assets\/images\/features\/card-texture.png"/);
  }
  const artwork = read("src/components/sections/testimonial/visuals/artwork-layer.tsx");
  assert.match(artwork, /"brotherhood-archive.png": "\/assets\/images\/business-lines\/property-riso.png"/);
  // Optimized renditions must retain the PNG input, not WebP shrink-on-load.
  assert.match(artwork, /"engraved-texture.png": "\/assets\/images\/key-metrics\/engraved-ink.png"/);
});

test("Direct-delivery images use lossless copies without changing loading or geometry", () => {
  const metric = read("src/components/sections/key-metrics/metric-bar.tsx");
  assert.match(metric, /engraved-ink.webp/);
  assert.match(metric, /halftone-band.webp/);
  assert.match(metric, /const BAR_WIDTH = 369.667/);
  assert.match(metric, /const BAR_HEIGHT = 22/);
  const prevention = read("src/components/sections/features/visuals/prevention-visual.tsx");
  assert.match(prevention, /unoptimized=\{recommendation.image === "fire-door-maintenance.webp"\}/);
  assert.match(prevention, /width=\{46\}\s+height=\{46\}/);
  assert.doesNotMatch(prevention, /preload|loading="eager"/);
});

test("Both homepage routes gate query reads and keep the existing server composition", () => {
  for (const path of ["src/app/page.tsx", "src/app/homepage/page.tsx"]) {
    const source = read(path);
    assert.match(source, /GRID_QA_ENABLED && \(await searchParams\).grid === "true"/);
    assert.doesNotMatch(source, /use client/);
    assert.match(source, /<PageGridOverlay visible=\{gridOn\}/);
    assert.match(source, /<GridToggle pathname=/);
  }
});

// Execute the real hook with deterministic React-effect and browser-API stubs.
// This is a Node unit test: no browser, layout engine, or test dependency needed.
function annotationHarness(visibility = "visible") {
  const frames = new Map();
  const intervals = new Map();
  const observers = new Set();
  const fontCallbacks = [];
  let nextId = 1;
  let state;
  let dependencies;
  let cleanup;
  let measurements = 0;

  function target() {
    const listeners = new Map();
    return {
      listeners,
      addEventListener(type, callback) {
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type).add(callback);
      },
      removeEventListener(type, callback) { listeners.get(type)?.delete(callback); },
      emit(type) { for (const callback of listeners.get(type) ?? []) callback(); },
      count() { return [...listeners.values()].reduce((sum, set) => sum + set.size, 0); },
    };
  }
  const document = { ...target(), visibilityState: visibility, body: {}, fonts: { ready: { then: (callback) => fontCallbacks.push(callback) } } };
  const window = {
    ...target(),
    setInterval(callback, duration) {
      assert.equal(duration, 1000);
      const id = nextId++;
      intervals.set(id, callback);
      return id;
    },
    clearInterval(id) { intervals.delete(id); },
  };
  const exports = {};
  runInNewContext(ts.transpileModule(read("src/review/lib/use-annotation-positions.ts"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports, document, window,
    requestAnimationFrame(callback) {
      const id = nextId++;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame(id) { frames.delete(id); },
    ResizeObserver: class {
      constructor(callback) { this.callback = callback; }
      observe(element) { assert.equal(element, document.body); observers.add(this); }
      disconnect() { observers.delete(this); }
    },
    require(name) {
      if (name === "react") return {
        useState(initial) {
          state ??= initial;
          return [state, (update) => { state = update(state); }];
        },
        useEffect(effect, next) {
          if (dependencies && next.every((item, index) => Object.is(item, dependencies[index]))) return;
          cleanup?.();
          dependencies = next;
          cleanup = effect();
        },
      };
      if (name === "@/review/lib/annotation-positioning") return {
        resolveAnchor(anchor) { measurements++; return { ...anchor }; },
      };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  return {
    frames, intervals, observers, document, window,
    get measurements() { return measurements; },
    render: exports.useAnnotationPositions,
    flush() {
      const pending = [...frames.values()];
      frames.clear();
      for (const callback of pending) callback();
    },
    fontsReady() { for (const callback of fontCallbacks) callback(); },
    visibility(value) { document.visibilityState = value; document.emit("visibilitychange"); },
    unmount() { cleanup?.(); cleanup = undefined; dependencies = undefined; },
  };
}

const entries = () => [{ id: "one", anchor: { x: 10, y: 20, width: 30, height: 40, attached: true } }];

test("Empty annotations install no listeners, observers, timers, or font callbacks", () => {
  const h = annotationHarness();
  assert.equal(Object.keys(h.render([])).length, 0);
  h.fontsReady();
  assert.equal(h.window.count() + h.document.count() + h.observers.size + h.intervals.size + h.frames.size, 0);
});

test("Active annotations coalesce triggers and retain equal-position state", () => {
  const h = annotationHarness();
  const list = entries();
  h.render(list);
  h.window.emit("scroll");
  h.window.emit("resize");
  h.fontsReady();
  for (const observer of h.observers) observer.callback();
  assert.equal(h.frames.size, 1);
  h.flush();
  assert.equal(h.measurements, 1);
  const first = h.render(list);
  assert.equal(first.one.x, 10);
  h.window.emit("scroll");
  h.flush();
  assert.equal(h.render(list), first);
  list[0].anchor.x = 50;
  for (const callback of h.intervals.values()) callback();
  h.flush();
  assert.equal(h.render(list).one.x, 50);
  h.unmount();
});

test("Removing all annotations cleans up work and hides stale positions", () => {
  const h = annotationHarness();
  h.render(entries());
  h.flush();
  assert.equal(Object.keys(h.render([])).length, 0);
  h.fontsReady();
  assert.equal(h.window.count() + h.document.count() + h.observers.size + h.intervals.size + h.frames.size, 0);
});

test("Hidden tabs cancel pending measurements and timers, then refresh on return", () => {
  const h = annotationHarness();
  h.render(entries());
  assert.equal(h.intervals.size, 1);
  h.visibility("hidden");
  h.window.emit("scroll");
  h.window.emit("resize");
  h.fontsReady();
  for (const observer of h.observers) observer.callback();
  assert.equal(h.frames.size + h.intervals.size, 0);
  assert.equal(h.measurements, 0);
  h.visibility("visible");
  assert.equal(h.frames.size, 1);
  assert.equal(h.intervals.size, 1);
  h.flush();
  assert.equal(h.measurements, 1);
  h.unmount();
});

test("Initially hidden documents wait for visibility before measuring", () => {
  const h = annotationHarness("hidden");
  h.render(entries());
  assert.equal(h.frames.size + h.intervals.size, 0);
  h.visibility("visible");
  h.flush();
  assert.equal(h.measurements, 1);
  h.unmount();
});

test("Cleanup blocks late callbacks and remount does not duplicate subscriptions", () => {
  const h = annotationHarness();
  const list = entries();
  h.render(list);
  const lateResize = [...h.observers][0].callback;
  h.unmount();
  h.fontsReady();
  lateResize();
  assert.equal(h.window.count() + h.document.count() + h.observers.size + h.intervals.size + h.frames.size, 0);
  h.render(list);
  assert.equal(h.window.count(), 2);
  assert.equal(h.document.count(), 1);
  assert.equal(h.observers.size, 1);
  assert.equal(h.intervals.size, 1);
  h.unmount();
});
