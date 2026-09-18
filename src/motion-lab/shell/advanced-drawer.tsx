import type { Selection } from "../registry";
import { ORIGINAL_ID } from "../registry";
import styles from "./lab.module.css";

/**
 * Engineering detail, collapsed by default. This is the only place ids, file
 * paths and stage URLs appear.
 */
export function AdvancedDrawer({ selection, stageHref }: { selection: Selection | null; stageHref: string | null }) {
  if (!selection) return null;
  const entryId = selection.concept?.id ?? ORIGINAL_ID;
  return (
    <details className={styles.advanced}>
      <summary>Advanced</summary>
      <dl className={styles.advancedList}>
        <dt>Component</dt>
        <dd>{selection.section.componentName}</dd>
        <dt>Source</dt>
        <dd>{selection.section.path}</dd>
        <dt>Section id</dt>
        <dd>{selection.section.id}</dd>
        <dt>Entry id</dt>
        <dd>{entryId}</dd>
        {selection.concept && (
          <>
            <dt>Storyline file</dt>
            <dd>{selection.concept.storyline}</dd>
          </>
        )}
        <dt>Stage URL</dt>
        <dd>{stageHref ?? "—"}</dd>
      </dl>
    </details>
  );
}
