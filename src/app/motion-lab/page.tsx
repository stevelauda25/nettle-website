import { notFound } from "next/navigation";

/**
 * Motion Lab home: the workspace with no section selected. DEV ONLY.
 *
 * The lab imports live inside a branch on the build-time constant
 * `process.env.NODE_ENV`, the same shape as ReviewMode, so a production build
 * drops the branch and every module it would have loaded.
 */
export default async function MotionLabHome() {
  if (process.env.NODE_ENV !== "production") {
    const [{ LabShell }, { sections }] = await Promise.all([
      import("@/motion-lab/shell/lab-shell"),
      import("@/motion-lab/registry"),
    ]);
    return <LabShell sections={sections} selection={null} />;
  }
  notFound();
}
