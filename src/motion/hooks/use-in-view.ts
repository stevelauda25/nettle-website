import { useEffect, useState, type RefObject } from "react";

type Options = IntersectionObserverInit & {
  /** Stay true after the first intersection (default). */
  once?: boolean;
  /**
   * Observe the ref's parent instead of the ref itself. A `display: contents`
   * wrapper has no box, so MotionScope observes the element that contains it.
   */
  parent?: boolean;
};

/**
 * Whether an element is in the viewport. Server-rendered as false; becomes
 * true from the observer callback, never synchronously in an effect.
 */
export function useInView(ref: RefObject<Element | null>, { once = true, parent = false, ...init }: Options = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    const target = parent ? element?.parentElement : element;
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      init,
    );
    observer.observe(target);
    return () => observer.disconnect();
    // Observer options are read once per mount; the ref is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, once, parent]);

  return inView;
}
