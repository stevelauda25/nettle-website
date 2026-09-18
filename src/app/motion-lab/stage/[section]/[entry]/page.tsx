import { notFound } from "next/navigation";

/**
 * Stage document: one production part alone, at whatever viewport the iframe
 * gives it. DEV ONLY. Modes come from the query string so a reload reproduces
 * the view; transport arrives by message.
 */
export default async function MotionLabStage({ params, searchParams }: PageProps<"/motion-lab/stage/[section]/[entry]">) {
  if (process.env.NODE_ENV !== "production") {
    const [{ section: sectionId, entry: entryId }, query] = await Promise.all([params, searchParams]);
    const [{ findEntry }, { originals, visuals }, { modeFromSearchParams }, { StageDocument }] = await Promise.all([
      import("@/motion-lab/registry"),
      import("@/motion-lab/stage/originals"),
      import("@/motion-lab/stage/channel"),
      import("@/motion-lab/stage/stage-document"),
    ]);
    const selection = findEntry(sectionId, entryId);
    const loadOriginal = originals[sectionId];
    if (!selection || !loadOriginal) notFound();

    const mode = modeFromSearchParams(query);

    // Motion view of a Concept that names a production visual: that visual
    // alone, the focused workspace. Its implementation renders here once
    // Gate 1 has passed and it exists; today the visual is at rest.
    const focus = mode.motion && selection.concept?.visual ? selection.concept.visual : null;
    const loadVisual = focus ? visuals[sectionId] : undefined;
    if (focus && loadVisual) {
      const { Visual } = await loadVisual();
      return (
        <StageDocument section={selection.section} entryId={entryId} mode={mode} focus>
          <Visual visual={focus} />
        </StageDocument>
      );
    }

    // Original view (and every Original entry): the whole production part.
    const { Original } = await loadOriginal();
    return (
      <StageDocument section={selection.section} entryId={entryId} mode={mode}>
        <Original />
      </StageDocument>
    );
  }
  notFound();
}
