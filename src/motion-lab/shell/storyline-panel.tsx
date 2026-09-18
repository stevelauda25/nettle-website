import type { Selection } from "../registry";
import styles from "./lab.module.css";

/**
 * Below the preview: the approved storyline the Concept implements. Original
 * has none. A Concept's storyline will be rendered from its colocated
 * storyline.md once Concepts exist; nothing is fabricated here.
 */
export function StorylinePanel({ selection }: { selection: Selection | null }) {
  return (
    <section className={styles.storyline} aria-label="Storyline">
      <div className={styles.paneHead}>
        <span className={styles.paneTitle}>Storyline</span>
      </div>
      {!selection ? (
        <p className={styles.paneNote}>The approved storyline for a Concept appears here, beside the preview.</p>
      ) : selection.concept ? (
        <p className={styles.paneNote}>Storyline for “{selection.concept.title}” will render here from its approved storyline file.</p>
      ) : (
        <p className={styles.paneNote}>
          Original has no storyline. Every Concept for {selection.section.title} starts as a storyline that the Motion Designer
          approves before anything is built; its beats will appear here.
        </p>
      )}
    </section>
  );
}
