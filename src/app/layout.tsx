import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nettle",
  description: "The AI workspace for Risk Control",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
