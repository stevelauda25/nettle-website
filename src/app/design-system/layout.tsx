import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Nettle Design System",
    template: "%s | Nettle Design System",
  },
  description: "Internal review of the Nettle design foundation.",
  robots: { index: false, follow: false },
};

export default function DesignSystemLayout({ children }: LayoutProps<"/design-system">) {
  return children;
}
