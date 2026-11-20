import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { weddingDetails } from "@/src/data/weddingDetails";
import "./globals.css";

// Fonts are bundled with the project (SIL Open Font License), so nothing is
// fetched from a font service at build time or in the browser.
const marcellus = localFont({
  src: "./fonts/marcellus-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

const garamond = localFont({
  src: [
    { path: "./fonts/eb-garamond-latin-wght-normal.woff2", weight: "400 800", style: "normal" },
    { path: "./fonts/eb-garamond-latin-wght-italic.woff2", weight: "400 800", style: "italic" },
  ],
  variable: "--font-garamond",
  display: "swap",
});

const pinyon = localFont({
  src: "./fonts/pinyon-script-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: weddingDetails.meta.title,
  description: weddingDetails.meta.description,
  openGraph: {
    title: weddingDetails.meta.title,
    description: weddingDetails.meta.description,
    type: "website",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#17352c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${marcellus.variable} ${garamond.variable} ${pinyon.variable}`}>
      <body>{children}</body>
    </html>
  );
}
