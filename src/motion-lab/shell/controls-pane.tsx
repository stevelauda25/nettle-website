import { CONTROL_GROUP_LABELS, CONTROL_GROUPS } from "@/motion/spec";
import type { Selection } from "../registry";
import styles from "./lab.module.css";

/**
 * Right pane: Motion Controls, grouped in the designer's words. The layout is
 * fixed now so that when tuning arrives it fills these groups and nothing else
 * moves. Original has nothing to tune, and there are no Concepts yet, so every
 * group shows its empty state. No invented values.
 */
export function ControlsPane({ selection }: { selection: Selection | null }) {
  const note = !selection
    ? "Choose a section to see its controls."
    : selection.concept
      ? "Controls arrive with tuning. Until then this Concept's values are edited by its author."
      : "Original has nothing to tune. Controls appear once a Concept exists for this section.";

  return (
    <aside className={styles.controls} aria-label="Motion controls">
      <div className={styles.paneHead}>
        <span className={styles.paneTitle}>Motion controls</span>
      </div>
      <p className={styles.paneNote}>{note}</p>
      <ul className={styles.groupList}>
        {CONTROL_GROUPS.map((group) => (
          <li key={group} className={styles.groupItem} data-inactive="">
            <span className={styles.groupTitle}>{CONTROL_GROUP_LABELS[group]}</span>
            <span className={styles.groupEmpty}>—</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
