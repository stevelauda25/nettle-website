/**
 * Review Mode entry point, rendered once in the root layout. With
 * NEXT_PUBLIC_REVIEW_MODE !== "true" it renders nothing: no toolbar, no
 * annotation layer and no review requests.
 *
 * The env var is inlined at build time, so the compiler removes the dead
 * branch and its import: disabled builds ship no review JavaScript or CSS.
 * Keep the check inline (not via REVIEW_MODE_ENABLED) so that stays true.
 */
export async function ReviewMode() {
  if (process.env.NEXT_PUBLIC_REVIEW_MODE === "true") {
    const { ReviewApp } = await import("@/review/components/review-app");
    return <ReviewApp />;
  }
  return null;
}
