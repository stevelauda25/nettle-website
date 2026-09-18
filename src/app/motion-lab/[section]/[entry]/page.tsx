import { notFound } from "next/navigation";

/** Motion Lab workspace for one section entry (Original or a Concept). DEV ONLY. */
export default async function MotionLabEntry({ params }: PageProps<"/motion-lab/[section]/[entry]">) {
  if (process.env.NODE_ENV !== "production") {
    const { section, entry } = await params;
    const [{ LabShell }, { findEntry, sections }] = await Promise.all([
      import("@/motion-lab/shell/lab-shell"),
      import("@/motion-lab/registry"),
    ]);
    const selection = findEntry(section, entry);
    if (!selection) notFound();
    return <LabShell sections={sections} selection={selection} />;
  }
  notFound();
}
