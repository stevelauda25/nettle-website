/**
 * Motion Lab metadata types. DEV ONLY.
 *
 * Two state axes, kept apart on purpose:
 *  - ConceptState: how far a Concept has travelled through the workflow.
 *  - ValuesState: whether what the designer sees is recorded anywhere.
 * Persistence mechanics (browser storage, snapshot files, production defaults)
 * are implementation details behind these words and never appear in the UI.
 */

export type ConceptState = "storyline" | "draft" | "in-review" | "approved" | "live";

export type ValuesState = "unsaved" | "saved" | "same-as-live";

export type Owner = "rycho" | "agil";

export type ConceptMeta = {
  /** URL segment, unique within its section. */
  id: string;
  /** What the designer reads. */
  title: string;
  /** One line: what this Concept does. */
  summary: string;
  owner: Owner;
  state: ConceptState;
  /**
   * Path of the colocated storyline.md, relative to the section folder. A
   * Concept can only reach `draft` once this file carries an approval line
   * (Gate 1); the guard test enforces it.
   */
  storyline: string;
};

export type SectionMeta = {
  /** URL segment, e.g. "hero". */
  id: string;
  /** Designer-facing name, e.g. "Hero". */
  title: string;
  /** One line: what the production part contains. Facts, not intent. */
  summary: string;
  /** Whether this is a <main> section or surrounding layout (header, footer). */
  kind: "section" | "layout";
  /** Engineering detail for the advanced drawer. */
  componentName: string;
  path: string;
  concepts: ConceptMeta[];
};
