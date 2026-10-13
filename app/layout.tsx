import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-sans", display: "swap" });
const lora = Lora({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

const siteUrl = "https://www.ambroisepartners.com";

const description = "Independent strategic and financial advisory dedicated to healthcare innovation: M&A, capital raising, partnerships & licensing. Paris · London.";

export const metadata: Metadata = {
  title: "Ambroise Partners | Healthcare Financial Advisory",
  description,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ambroise Partners | Healthcare Financial Advisory",
    description,
    url: siteUrl,
    siteName: "Ambroise Partners",
    locale: "en_GB",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Ambroise Partners: independent strategic and financial advisory dedicated to healthcare innovation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ambroise Partners | Healthcare Financial Advisory",
    description,
    images: ["/og-image.png"],
  },
  authors: [{ name: "Ambroise Partners" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${lora.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
