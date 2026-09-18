import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: { default: "Nettle Motion Lab", template: "%s | Nettle Motion Lab" },
  description: "Internal motion workspace. Development only.",
  robots: { index: false, follow: false },
};

/**
 * Motion Lab gate. DEV ONLY.
 *
 * `process.env.NODE_ENV` is inlined at build time, so in a production build
 * every route under /motion-lab is a 404 before any lab code runs, and the
 * pages' `await import()` of the lab is dead code the bundler drops. Preview
 * deployments are production builds, so they are covered too. There is no
 * flag to flip; the lab exists only under `next dev`.
 */
export default function MotionLabLayout({ children }: LayoutProps<"/motion-lab">) {
  if (process.env.NODE_ENV === "production") notFound();
  return children;
}
