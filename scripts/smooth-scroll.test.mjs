import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const controller = read("src/components/layout/smooth-scroll-controller.ts");
const compiled = ts.transpileModule(controller, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function target(extra = {}) {
  const listeners = new Map();
  return {
    ...extra, listeners,
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(callback);
    },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback); },
    emit(name) { for (const callback of listeners.get(name) ?? []) callback(); },
    count() { return [...listeners.values()].reduce((sum, set) => sum + set.size, 0); },
  };
}

function harness({ reduced = false, coarse = false, hidden = false, deferred = false } = {}) {
  const motion = target({ matches: !reduced });
  const pointer = target({ matches: !coarse });
  const document = target({ hidden });
  const window = target({ matchMedia: (query) => query.includes("motion") ? motion : pointer });
  const frames = new Map();
  const instances = [];
  const pending = [];
  let nextId = 0;
  let loads = 0;
  let now = 100;
  class Element {
    constructor(native = false) { this.native = native; }
    matches(selector) { assert.match(selector, /data-review-ui/); return this.native; }
  }
  class FakeLenis {
    constructor(options) {
      this.options = options;
      this.isScrolling = false;
      this.calls = [];
      this.resets = 0;
      this.actualScroll = 123;
      this.destroyed = false;
      instances.push(this);
    }
    raf(time) { this.calls.push(time); }
    scrollTo(position, options) {
      assert.equal(position, this.actualScroll);
      assert.equal(options.immediate, true);
      this.isScrolling = false;
      this.resets++;
    }
    destroy() { this.destroyed = true; }
  }
  const exports = {};
  runInNewContext(compiled, {
    exports, window, document, Element, performance: { now: () => now },
    requestAnimationFrame(callback) { frames.set(++nextId, callback); return nextId; },
    cancelAnimationFrame(id) { frames.delete(id); },
  });
  const cleanup = exports.setupSmoothScroll(() => {
    loads++;
    return deferred ? new Promise((resolve, reject) => pending.push({ resolve, reject })) :
      Promise.resolve({ default: FakeLenis });
  });
  return {
    motion, pointer, document, window, frames, instances, pending, cleanup,
    get loads() { return loads; },
    resolve(index) { pending[index].resolve({ default: FakeLenis }); },
    wheel(overrides = {}, nativeTarget = false) {
      const instance = instances.at(-1);
      const result = instance.options.virtualScroll({ deltaX: 0, deltaY: 50,
        ...overrides, event: { type: "wheel", ctrlKey: false, shiftKey: false,
          composedPath: () => [new Element(nativeTarget)], ...overrides.event } });
      // Lenis begins the wheel animation after virtualScroll returns.
      if (result) instance.isScrolling = "smooth";
      return result;
    },
    frame(time) {
      now = time;
      const work = [...frames.values()];
      frames.clear();
      work.forEach((callback) => callback(time));
    },
  };
}
const flush = () => new Promise((resolve) => setImmediate(resolve));

test("Only eligible visible fine-pointer pages load the optional library", async () => {
  for (const options of [{ reduced: true }, { coarse: true }, { hidden: true }]) {
    const h = harness(options);
    await flush();
    assert.equal(h.loads, 0);
    assert.equal(h.instances.length, 0);
    h.cleanup();
  }
  const h = harness();
  await flush();
  assert.equal(h.loads, 1);
  const options = h.instances[0].options;
  assert.equal(options.lerp, 0.1);
  assert.equal(options.wheelMultiplier, 1);
  assert.equal(options.autoRaf, false);
  assert.equal(options.syncTouch, false);
  assert.equal(options.anchors, false);
  assert.equal(h.frames.size, 0);
  h.cleanup();
});

test("Wheel work sleeps when settled and primes the clock after idle", async () => {
  const h = harness();
  await flush();
  const instance = h.instances[0];
  assert.equal(h.wheel(), true);
  assert.deepEqual(instance.calls, [100]);
  h.wheel();
  assert.equal(h.frames.size, 1);
  h.frame(116);
  assert.equal(h.frames.size, 1);
  instance.isScrolling = false;
  h.frame(132);
  assert.equal(h.frames.size, 0);
  h.frame(10000);
  h.wheel();
  assert.equal(instance.calls.at(-1), 10000);
  h.cleanup();
  assert.equal(h.frames.size, 0);
});

test("Touch, horizontal gestures, zoom, shift-wheel and review/form targets remain native", async () => {
  const h = harness();
  await flush();
  for (const [event, native] of [
    [{ event: { type: "touchmove" } }, false],
    [{ deltaX: 60, deltaY: 5 }, false],
    [{ event: { ctrlKey: true } }, false],
    [{ event: { shiftKey: true } }, false],
    [{}, true],
  ]) {
    h.wheel();
    assert.equal(h.wheel(event, native), false);
    assert.equal(h.frames.size, 0);
    assert.equal(h.instances[0].isScrolling, false);
  }
  assert.match(controller, /input, textarea, select, \[contenteditable\]/);
  h.cleanup();
});

test("Native navigation and review interactions cancel residual inertia", async () => {
  const h = harness();
  await flush();
  for (const name of ["pointerdown", "keydown", "click", "focusin", "popstate", "hashchange"]) {
    h.wheel();
    h.window.emit(name);
    assert.equal(h.frames.size, 0, name);
    assert.equal(h.instances[0].isScrolling, false, name);
  }
  h.cleanup();
});

test("Visibility and preference changes destroy/recreate; cleanup removes every listener", async () => {
  const h = harness();
  await flush();
  for (const [object, property, event] of [
    [h.document, "hidden", "visibilitychange"],
    [h.motion, "matches", "change"],
    [h.pointer, "matches", "change"],
  ]) {
    const old = h.instances.at(-1);
    h.wheel();
    object[property] = !object[property];
    object.emit(event);
    assert.equal(old.destroyed, true);
    assert.equal(h.frames.size, 0);
    assert.equal(h.window.count(), 0);
    object[property] = !object[property];
    object.emit(event);
    await flush();
    assert.notEqual(h.instances.at(-1), old);
  }
  h.cleanup();
  for (const object of [h.window, h.document, h.motion, h.pointer]) assert.equal(object.count(), 0);
  assert.ok(h.instances.every((instance) => instance.destroyed));
});

test("Late imports cannot reactivate an unmounted page or tear down a newer instance", async () => {
  const h = harness({ deferred: true });
  h.document.hidden = true;
  h.document.emit("visibilitychange");
  h.document.hidden = false;
  h.document.emit("visibilitychange");
  h.resolve(1);
  await flush();
  h.pending[0].reject(new Error("stale chunk"));
  await flush();
  assert.equal(h.instances[0].destroyed, false);
  h.cleanup();

  const unmounted = harness({ deferred: true });
  unmounted.cleanup();
  unmounted.resolve(0);
  await flush();
  assert.equal(unmounted.instances.length, 0);
});

test("Chunk failure leaves native scrolling and no active frame", async () => {
  const h = harness({ deferred: true });
  h.pending[0].reject(new Error("offline"));
  await flush();
  assert.equal(h.frames.size, 0);
  assert.equal(h.window.count(), 0);
  h.cleanup();
});

test("Homepage-only null island preserves server content, sticky ancestors and foundations", () => {
  const island = read("src/components/layout/smooth-scroll.tsx");
  assert.match(island, /return null/);
  assert.match(controller, /import\("lenis"\)/);
  assert.doesNotMatch(controller, /useState|preventDefault|getBoundingClientRect|setInterval|style\./);
  for (const path of ["src/app/page.tsx", "src/app/homepage/page.tsx"]) {
    const page = read(path);
    assert.equal((page.match(/<SmoothScroll \/>/g) ?? []).length, 1);
    assert.doesNotMatch(page, /use client/);
    assert.match(page, /<VideoExplainer \/>[\s\S]*<ChallengeToday \/>[\s\S]*<Features \/>/);
  }
  assert.doesNotMatch(read("src/app/layout.tsx"), /SmoothScroll/);
  assert.doesNotMatch(read("src/app/design-system/layout.tsx"), /SmoothScroll/);
});
