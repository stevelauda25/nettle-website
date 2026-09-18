"use client";

import { useEffect } from "react";
import "lenis/dist/lenis.css";
import { setupSmoothScroll } from "./smooth-scroll-controller";

/** A behaviour-only island: the homepage and its artwork stay server-rendered. */
export function SmoothScroll() {
  useEffect(() => setupSmoothScroll(), []);
  return null;
}
