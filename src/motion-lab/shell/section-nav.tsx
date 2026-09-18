"use client";

import Link from "next/link";
import { useState } from "react";
import { CONCEPT_STATE_LABELS, ORIGINAL_ID, sectionHighestState } from "../registry";
import type { SectionMeta } from "../types";
import { ConceptStateChip } from "./state-chips";
import styles from "./lab.module.css";

type SectionNavProps = {
  sections: readonly SectionMeta[];
  selectedSectionId: string | null;
  selectedEntryId: string | null;
};

const ownerInitial = (owner: string) => owner.charAt(0).toUpperCase();

/**
 * Left pane: homepage parts in production order. The selected section is
 * expanded and shows Original first, then its Concepts with state and owner.
 * The filter narrows by section title, concept title or state name.
 */
export function SectionNav({ sections, selectedSectionId, selectedEntryId }: SectionNavProps) {
  const [filter, setFilter] = useState("");
  const query = filter.trim().toLowerCase();

  const visible = sections.filter((section) => {
    if (!query) return true;
    if (section.title.toLowerCase().includes(query)) return true;
    return section.concepts.some(
      (concept) =>
        concept.title.toLowerCase().includes(query) || CONCEPT_STATE_LABELS[concept.state].toLowerCase().includes(query),
    );
  });

  return (
    <nav className={styles.nav} aria-label="Sections">
      <div className={styles.navHead}>
        <span className={styles.brand}>Nettle Motion Lab</span>
        <span className={styles.devBadge}>development</span>
      </div>
      <label className={styles.filter}>
        <span className={styles.srOnly}>Filter sections and concepts</span>
        <input
          id="motion-lab-filter"
          type="search"
          placeholder="Filter sections, concepts, states"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </label>

      <ol className={styles.sectionList}>
        {visible.map((section) => {
          const selected = section.id === selectedSectionId;
          const highest = sectionHighestState(section);
          const concepts = query
            ? section.concepts.filter(
                (concept) =>
                  concept.title.toLowerCase().includes(query) ||
                  CONCEPT_STATE_LABELS[concept.state].toLowerCase().includes(query) ||
                  section.title.toLowerCase().includes(query),
              )
            : section.concepts;
          return (
            <li key={section.id} className={styles.sectionItem} data-selected={selected ? "" : undefined}>
              <Link href={`/motion-lab/${section.id}/${ORIGINAL_ID}`} className={styles.sectionLink} aria-current={selected ? "true" : undefined}>
                <span className={styles.sectionTitle}>{section.title}</span>
                <span className={styles.sectionMeta}>
                  {section.concepts.length === 0
                    ? "no concepts"
                    : `${section.concepts.length} ${section.concepts.length === 1 ? "concept" : "concepts"}`}
                  {highest && <ConceptStateChip state={highest} />}
                </span>
              </Link>
              {(selected || query) && (
                <ul className={styles.entryList}>
                  <li>
                    <Link
                      href={`/motion-lab/${section.id}/${ORIGINAL_ID}`}
                      className={styles.entryLink}
                      aria-current={selected && selectedEntryId === ORIGINAL_ID ? "page" : undefined}
                    >
                      <span>Original</span>
                      <span className={styles.entryHint}>production</span>
                    </Link>
                  </li>
                  {concepts.map((concept) => (
                    <li key={concept.id}>
                      <Link
                        href={`/motion-lab/${section.id}/${concept.id}`}
                        className={styles.entryLink}
                        aria-current={selected && selectedEntryId === concept.id ? "page" : undefined}
                      >
                        <span>{concept.title}</span>
                        <span className={styles.entryHint}>
                          <span className={styles.owner} title={concept.owner}>{ownerInitial(concept.owner)}</span>
                          <ConceptStateChip state={concept.state} />
                        </span>
                      </Link>
                    </li>
                  ))}
                  {selected && section.concepts.length === 0 && (
                    <li className={styles.entryEmpty}>Concepts appear here once a storyline is approved.</li>
                  )}
                </ul>
              )}
            </li>
          );
        })}
        {visible.length === 0 && <li className={styles.entryEmpty}>Nothing matches “{filter}”.</li>}
      </ol>
    </nav>
  );
}
