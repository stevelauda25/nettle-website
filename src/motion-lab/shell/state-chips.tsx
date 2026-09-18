import { CONCEPT_STATE_LABELS, VALUES_STATE_LABELS } from "../registry";
import type { ConceptState, ValuesState } from "../types";
import styles from "./lab.module.css";

export function ConceptStateChip({ state }: { state: ConceptState | "original" }) {
  return (
    <span className={styles.chip} data-state={state}>
      {state === "original" ? "Original" : CONCEPT_STATE_LABELS[state]}
    </span>
  );
}

export function ValuesStateChip({ state }: { state: ValuesState }) {
  return (
    <span className={styles.chip} data-values={state}>
      {VALUES_STATE_LABELS[state]}
    </span>
  );
}
