/**
 * Grid QA tools (overlay + toggle) are available in development and in
 * internal review builds (staging / Vercel previews with
 * NEXT_PUBLIC_REVIEW_MODE=true). A public build with Review Mode off strips
 * them. Both env vars are inlined at build time.
 */
export const GRID_QA_ENABLED =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_REVIEW_MODE === "true";
