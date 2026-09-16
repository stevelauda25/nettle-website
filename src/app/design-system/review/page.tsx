import type { Metadata } from "next";
import { FoundationTable } from "../_components/foundation-table";
import { OnThisPage, type OnThisPageItem } from "../_components/on-this-page";
import { DocsShell } from "../_components/docs-shell";
import { figmaInconsistencies, openQuestions, type ReviewNote } from "../_data/foundation";

export const metadata: Metadata = { title: "Review notes" };

const onThisPageItems: readonly OnThisPageItem[] = [
  { label: "Open questions", href: "#open-questions" },
  { label: "Figma inconsistencies", href: "#figma-inconsistencies" },
];

function noteRows(notes: ReviewNote[]) {
  return notes.map((note, index) => [
    { content: String(index + 1), secondary: true },
    {
      content: (
        <span className="flex flex-col gap-0.5 py-1">
          <span className="text-text-primary">{note.title}</span>
          <span className="text-text-secondary">{note.detail}</span>
        </span>
      ),
    },
  ]);
}

export default function ReviewPage() {
  return (
    <DocsShell
      pageTitle="Review notes"
      activePath="/design-system/review"
      breadcrumb={{ parent: "Nettle Design System", current: "Review notes" }}
      detailRail={<OnThisPage items={onThisPageItems} />}
      smoothAnchorScroll
    >
      <header className="flex min-h-12 w-full flex-col gap-1 border-b border-border-subtle px-3 pb-6">
        <h1 className="text-base leading-6 font-medium tracking-[0] text-text-primary">Review notes</h1>
        <p className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">
          Decisions that still need design input, and inconsistencies found while reading the Figma file.
        </p>
      </header>

      <section id="open-questions" className="flex w-full flex-col gap-2.5">
        <div className="flex flex-col gap-1 px-3">
          <h2 className="text-sm leading-5 font-medium tracking-[0] text-text-primary">Open questions</h2>
          <p className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">
            Not defined in Figma. Values are either missing from the site or temporarily inferred.
          </p>
        </div>
        <FoundationTable
          columns={[
            { label: "#", width: 40 },
            { label: "Question", width: 544 },
          ]}
          rows={noteRows(openQuestions)}
        />
      </section>

      <section id="figma-inconsistencies" className="flex w-full flex-col gap-2.5">
        <div className="flex flex-col gap-1 px-3">
          <h2 className="text-sm leading-5 font-medium tracking-[0] text-text-primary">Figma inconsistencies</h2>
          <p className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">
            Implemented exactly as defined in Figma. Listed here so design can confirm or correct them.
          </p>
        </div>
        <FoundationTable
          columns={[
            { label: "#", width: 40 },
            { label: "Note", width: 544 },
          ]}
          rows={noteRows(figmaInconsistencies)}
        />
      </section>
    </DocsShell>
  );
}
