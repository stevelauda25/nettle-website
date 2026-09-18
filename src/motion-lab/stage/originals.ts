/**
 * Server-side map from section id to its Original component. DEV ONLY.
 *
 * Kept apart from the registry so the client shell never imports a Server
 * Component. Each entry is a dynamic import, so a stage loads one section's
 * code, not all twelve.
 */
import type { ComponentType } from "react";

type OriginalModule = { Original: ComponentType };
type VisualModule = { Visual: ComponentType<{ visual: string }> };

export const originals: Record<string, () => Promise<OriginalModule>> = {
  "site-header": () => import("../sections/site-header/original"),
  hero: () => import("../sections/hero/original"),
  "video-explainer": () => import("../sections/video-explainer/original"),
  "key-metrics": () => import("../sections/key-metrics/original"),
  "challenge-today": () => import("../sections/challenge-today/original"),
  features: () => import("../sections/features/original"),
  "business-lines": () => import("../sections/business-lines/original"),
  "solutions-by-role": () => import("../sections/solutions-by-role/original"),
  testimonial: () => import("../sections/testimonial/original"),
  security: () => import("../sections/security/original"),
  cta: () => import("../sections/cta/original"),
  footer: () => import("../sections/footer/original"),
};

/**
 * Sections whose Concepts name one production visual inside the part. The
 * stage renders that visual alone in the Motion view; the Original view is
 * always the whole part. Same dependency direction: lab → components.
 */
export const visuals: Record<string, () => Promise<VisualModule>> = {
  "business-lines": () => import("../sections/business-lines/visual"),
};
