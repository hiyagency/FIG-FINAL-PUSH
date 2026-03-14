import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";

import "@/app/globals.css";
import { businessInfo, seoKeywords } from "@/lib/site-data";
import { getSiteUrl } from "@/lib/fig-utils";

const headingFont = Poppins({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"]
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

const siteUrl = getSiteUrl();
const title =
  "Financial Investment Group (FIG) Burhar | Investment Planning Guidance in Shahdol";
const description =
  "Financial Investment Group (FIG) in Burhar, Shahdol provides structured investment planning guidance, savings conversations, and local financial consultation across Madhya Pradesh.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: businessInfo.name,
  category: "Financial Services",
  keywords: seoKeywords,
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: businessInfo.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${businessInfo.name} office and brand preview`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/twitter-image"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export const viewport: Viewport = {
  themeColor: "#0B1F4B",
  colorScheme: "light"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="font-[var(--font-body)] text-slate-950 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#0B1F4B] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
