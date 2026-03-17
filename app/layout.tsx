import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";

import "@/app/globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { siteConfig } from "@/lib/site";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans"
});

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "AI lead generation",
    "B2B prospecting",
    "lead discovery",
    "sales intelligence",
    "market research"
  ],
  openGraph: {
    title: siteConfig.ogTitle,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Lead.ai"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.ogTitle,
    description: siteConfig.description,
    images: ["/twitter-image"]
  }
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: "dark"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
