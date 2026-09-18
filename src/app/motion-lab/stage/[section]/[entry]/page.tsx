import { notFound } from "next/navigation";

/**
 * Stage document: one production part alone, at whatever viewport the iframe
 * gives it. DEV ONLY. Modes come from the query string so a reload reproduces
 * the view; transport arrives by message.
 */
export default async function MotionLabStage({ params, searchParams }: PageProps<"/motion-lab/stage/[section]/[entry]">) {
  if (process.env.NODE_ENV !== "production") {
    const [{ section: sectionId, entry: entryId }, query] = await Promise.all([params, searchParams]);
    const [{ findEntry }, { originals }, { modeFromSearchParams }, { StageDocument }] = await Promise.all([
      import("@/motion-lab/registry"),
      import("@/motion-lab/stage/originals"),
      import("@/motion-lab/stage/channel"),
      import("@/motion-lab/stage/stage-document"),
    ]);
    const selection = findEntry(sectionId, entryId);
    const loadOriginal = originals[sectionId];
    if (!selection || !loadOriginal) notFound();

    // A Concept renders its implementation once Gate 1 has passed and it exists.
    // Until then (every Concept today is at Storyline) it previews the section's
    // Original, unchanged.
    const { Original } = await loadOriginal();
    const mode = modeFromSearchParams(query);

    return (
      <StageDocument section={selection.section} entryId={entryId} mode={mode}>
        <Original />
      </StageDocument>
    );
  }
  notFound();
}
