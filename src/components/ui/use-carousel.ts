import { useEffect, useRef, useState } from "react";
import { createCarouselController } from "./carousel-controller";

/** Shared by the existing client wrappers; artwork remains server children. */
export function useCarousel(cardSelector: string) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ReturnType<typeof createCarouselController> | null>(null);
  const [available, setAvailable] = useState({ previous: false, next: false });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const controller = createCarouselController(viewport, cardSelector, setAvailable);
    controllerRef.current = controller;
    return () => {
      controllerRef.current = null;
      controller.destroy();
    };
  }, [cardSelector]);

  function move(direction: -1 | 1) {
    controllerRef.current?.move(direction);
  }

  return { viewportRef, available, move };
}
