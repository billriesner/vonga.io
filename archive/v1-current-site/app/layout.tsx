import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SITE, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Vonga",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "Vonga",
  keywords: [
    "connected apparel",
    "NFC apparel",
    "on-body engagement",
    "fan engagement",
    "university alumni connection",
    "fitness studio loyalty",
    "creator communities",
  ],
  authors: [{ name: "Vonga" }],
  creator: "Vonga",
  publisher: "Vonga",
  openGraph: {
    type: "website",
    url: SITE.domain,
    siteName: "Vonga",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      { url: "/images/tap-on-apparel.png", width: 1200, height: 630, alt: "Vonga — Connected Apparel & On-Body Engagement" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/images/tap-on-apparel.png"],
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  themeColor: "#0A1422",
  alternates: { canonical: SITE.domain },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Global JSON-LD for Organization + WebSite (with SearchAction) for LLMs/Google
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vonga",
    url: SITE.domain,
    logo: `${SITE.domain}/images/tap-on-apparel.png`,
    sameAs: [
      "https://www.linkedin.com/company/vonga",
      "https://x.com/vonga"
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vonga",
    url: SITE.domain,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.domain}/search?q={query}`,
      "query-input": "required name=query",
    },
  };

  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      </head>
      <body className="bg-[#0A1422] text-white">
        <GoogleAnalytics />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
