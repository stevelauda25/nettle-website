/**
 * Motion Lab registry — metadata only. DEV ONLY.
 *
 * One entry per homepage part, in production order (mirrored from
 * src/app/page.tsx and checked by scripts/motion.test.mjs). Each section owns
 * its own folder so two designers rarely edit the same file, and the shell
 * renders titles, summaries, owners and states — never ids or paths, which stay
 * in the advanced drawer.
 *
 * Components are deliberately NOT imported here: the shell is a client
 * component and the sections are Server Components. The stage resolves an
 * entry's Original through src/motion-lab/stage/originals.ts on the server.
 *
 * Relative imports on purpose: the guard test loads this file in Node, where
 * the `@/` alias does not exist.
 */
import businessLines from "./sections/business-lines";
import challengeToday from "./sections/challenge-today";
import cta from "./sections/cta";
import features from "./sections/features";
import footer from "./sections/footer";
import hero from "./sections/hero";
import keyMetrics from "./sections/key-metrics";
import security from "./sections/security";
import siteHeader from "./sections/site-header";
import solutionsByRole from "./sections/solutions-by-role";
import testimonial from "./sections/testimonial";
import videoExplainer from "./sections/video-explainer";
import type { ConceptMeta, ConceptState, Owner, SectionMeta, ValuesState } from "./types";

export const ORIGINAL_ID = "original";

/** Production order. Header first, then <main>, then footer. */
export const sections: readonly SectionMeta[] = [
  siteHeader,
  hero,
  videoExplainer,
  keyMetrics,
  challengeToday,
  features,
  businessLines,
  solutionsByRole,
  testimonial,
  security,
  cta,
  footer,
];

export type Selection = {
  section: SectionMeta;
  /** null means the Original entry. */
  concept: ConceptMeta | null;
};

export function findSection(sectionId: string): SectionMeta | null {
  return sections.find((section) => section.id === sectionId) ?? null;
}

export function findEntry(sectionId: string, entryId: string): Selection | null {
  const section = findSection(sectionId);
  if (!section) return null;
  if (entryId === ORIGINAL_ID) return { section, concept: null };
  const concept = section.concepts.find((item) => item.id === entryId);
  return concept ? { section, concept } : null;
}

export const CONCEPT_STATE_ORDER: readonly ConceptState[] = ["storyline", "draft", "in-review", "approved", "live"];

export const CONCEPT_STATE_LABELS: Record<ConceptState, string> = {
  storyline: "Storyline",
  draft: "Draft",
  "in-review": "In review",
  approved: "Approved",
  live: "Live",
};

/** Designer names as they read in the shell. */
export const OWNER_LABELS: Record<Owner, string> = {
  rycho: "Rycho",
  agil: "Agil",
};

export const VALUES_STATE_LABELS: Record<ValuesState, string> = {
  unsaved: "Unsaved changes",
  saved: "Saved",
  "same-as-live": "Same as live",
};

/** The furthest state any Concept in a section has reached, for the nav. */
export function sectionHighestState(section: SectionMeta): ConceptState | null {
  let highest: ConceptState | null = null;
  for (const concept of section.concepts) {
    if (highest === null || CONCEPT_STATE_ORDER.indexOf(concept.state) > CONCEPT_STATE_ORDER.indexOf(highest)) {
      highest = concept.state;
    }
  }
  return highest;
}
