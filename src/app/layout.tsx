import type { Metadata } from "next";
import { Crimson_Pro, La_Belle_Aurore } from "next/font/google";
import localFont from "next/font/local";
import { ReviewMode } from "@/review/components/review-mode";
import "./globals.css";

// Figma: Heading/* text styles
const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--font-crimson-pro",
});

// Figma: detached handwritten accent text (no text style)
const laBelleAurore = La_Belle_Aurore({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-la-belle-aurore",
});

// Figma: Body/* text styles
const suisseIntl = localFont({
  src: [
    { path: "./fonts/SuisseIntl-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/SuisseIntl-Medium.ttf", weight: "500", style: "normal" },
  ],
  display: "swap",
  variable: "--font-suisse-intl",
});

export const metadata: Metadata = {
  title: "Nettle",
  description: "The AI workspace for Risk Control",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${crimsonPro.variable} ${laBelleAurore.variable} ${suisseIntl.variable}`}>
      <body>
        {children}
        {/* Internal staging review tools; renders nothing unless NEXT_PUBLIC_REVIEW_MODE=true. */}
        <ReviewMode />
      </body>
    </html>
  );
}
