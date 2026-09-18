import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function nextConfig(phase: string): NextConfig {
  const useStagingReview =
    phase === PHASE_DEVELOPMENT_SERVER &&
    process.env.NEXT_PUBLIC_REVIEW_MODE === "true" &&
    process.env.REVIEW_USE_STAGING === "true";

  return {
    rewrites() {
      return {
        // Run before local API handlers so all review operations share staging's scope.
        beforeFiles: useStagingReview
          ? [
              {
                source: "/api/review/:path*",
                destination: "https://nettle-website.vercel.app/api/review/:path*",
              },
            ]
          : [],
      };
    },
  };
}
