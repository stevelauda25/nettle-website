import type Lenis from "lenis";

// Contra-like wheel damping; distance is unchanged, only arrival is softened.
const WHEEL_LERP = 0.1;
const NATIVE_TARGETS =
  '[data-review-ui], [data-lenis-prevent], [data-lenis-prevent-wheel], input, textarea, select, [contenteditable]:not([contenteditable="false"])';

/** Optional library loading also makes lifecycle checks possible without a browser. */
export function setupSmoothScroll(load = () => import("lenis")) {
  const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  const pointer = window.matchMedia("(pointer: fine)");
  let instance: Lenis | undefined;
  let frame: number | undefined;
  let generation = 0;
  let disposed = false;

  function cancelFrame() {
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = undefined;
  }

  function interrupt() {
    cancelFrame();
    // Cancel through the public API at the actual position; never lock native
    // scrolling or pull a review/anchor jump back toward an old wheel target.
    if (instance?.isScrolling === "smooth") {
      instance.scrollTo(instance.actualScroll, { immediate: true, force: true });
    }
  }

  function tick(time: number) {
    frame = undefined;
    instance?.raf(time);
    if (instance?.isScrolling === "smooth") frame = requestAnimationFrame(tick);
  }

  function wake() {
    if (frame !== undefined || !instance) return;
    // Prime the clock before Lenis starts the new wheel animation. Otherwise
    // the idle interval would be counted as one enormous animation frame.
    instance.raf(performance.now());
    frame = requestAnimationFrame(tick);
  }

  function release() {
    cancelFrame();
    instance?.destroy();
    instance = undefined;
    window.removeEventListener("pointerdown", interrupt, true);
    window.removeEventListener("keydown", interrupt, true);
    window.removeEventListener("click", interrupt, true);
    window.removeEventListener("focusin", interrupt);
    window.removeEventListener("popstate", interrupt);
    window.removeEventListener("hashchange", interrupt);
  }

  async function sync() {
    const version = ++generation;
    release();
    if (disposed || !motion.matches || !pointer.matches || document.hidden) return;

    try {
      const { default: SmoothScroller } = await load();
      if (disposed || version !== generation) return;
      instance = new SmoothScroller({
        lerp: WHEEL_LERP,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
        anchors: false,
        stopInertiaOnNavigate: true,
        virtualScroll: ({ event, deltaX, deltaY }) => {
          const nativeTarget = event.composedPath().some(
            (node) => node instanceof Element && node.matches(NATIVE_TARGETS),
          );
          // Keep pinch zoom, touch, horizontal carousel swipes, editable fields
          // and review-panel scrolling native. Do not inspect layout on wheel.
          if (event.type !== "wheel" || event.ctrlKey || event.shiftKey ||
              Math.abs(deltaX) >= Math.abs(deltaY) || nativeTarget) {
            interrupt();
            return false;
          }
          wake();
          return true;
        },
      });
      window.addEventListener("pointerdown", interrupt, { capture: true, passive: true });
      window.addEventListener("keydown", interrupt, true);
      window.addEventListener("click", interrupt, true);
      window.addEventListener("focusin", interrupt);
      window.addEventListener("popstate", interrupt);
      window.addEventListener("hashchange", interrupt);
    } catch {
      // A failed optional chunk must never prevent native page scrolling.
      if (version === generation) release();
    }
  }

  motion.addEventListener("change", sync);
  pointer.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  void sync();

  return () => {
    disposed = true;
    generation++;
    release();
    motion.removeEventListener("change", sync);
    pointer.removeEventListener("change", sync);
    document.removeEventListener("visibilitychange", sync);
  };
}
