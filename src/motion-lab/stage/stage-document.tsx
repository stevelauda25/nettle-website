import type { ReactNode } from "react";
import { PageGridOverlay } from "@/components/layout/grid";
import { MotionScope } from "@/motion/motion-scope";
import { EMPTY_SPEC } from "@/motion/spec";
import type { SectionMeta } from "../types";
import type { StageMode } from "./channel";
import { StageRoot } from "./stage-root";
import styles from "./stage.module.css";

type StageDocumentProps = {
  section: SectionMeta;
  entryId: string;
  mode: StageMode;
  /** The production part, rendered on the server. */
  children: ReactNode;
};

/**
 * The inner document of a preview. DEV ONLY. Server component.
 *
 * Only the real production part, wrapped in a MotionScope, with room to scroll
 * into and out of it so in-view triggers and scroll timelines behave as on the
 * homepage. The header is sticky and sits at the top; everything else gets a
 * runway above and below.
 */
export function StageDocument({ section, entryId, mode, children }: StageDocumentProps) {
  const runway = section.kind === "section";
  return (
    <StageRoot entry={`${section.id}/${entryId}`} mode={mode}>
      {runway && (
        <div className={styles.runway} aria-hidden="true">
          <span>scroll to enter {section.title}</span>
        </div>
      )}
      <MotionScope name={section.id} spec={EMPTY_SPEC} enabled={mode.motion} forceReduced={mode.reduced}>
        {children}
      </MotionScope>
      {runway && (
        <div className={styles.runway} aria-hidden="true">
          <span>{section.title} exit</span>
        </div>
      )}
      <PageGridOverlay visible={mode.grid} />
    </StageRoot>
  );
}
