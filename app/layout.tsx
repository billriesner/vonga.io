import type { Metadata } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vonga.io";
const siteName = "Vonga";
const defaultTitle = "Vonga | Create Experiences That Matter Through Connected Apparel";
const defaultDescription = "Turn moments into experiences with NFC-enabled team apparel. Create meaningful fan connections, unlock exclusive content, and build lasting belonging—no app required. The experience platform for sports teams, universities, and communities.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    // Primary keywords
    "NFC-enabled apparel",
    "connected merchandise",
    "fan engagement platform",
    "team apparel experiences",
    "smart sports apparel",
    "NFC jerseys",
    "fan experience platform",
    "location-aware fan engagement",
    "no-app fan engagement",
    "sports team merchandise platform",
    // Secondary keywords
    "NFC team apparel",
    "connected sports merchandise",
    "interactive team apparel",
    "fan connection platform",
    "sports fan experiences",
    "team kit platform",
    "NFC-enabled team kits",
    "fan engagement solutions",
    "sports merchandise platform",
    "university apparel experiences",
    // Long-tail keywords
    "how to create fan experiences with apparel",
    "NFC apparel for sports teams",
    "connected merchandise for universities",
    "fan engagement without app download",
    "location-based fan experiences",
    "team apparel that creates experiences",
    "NFC technology in sports merchandise",
    "fan connection through apparel",
    "sports team experience platform",
    "create experiences with team apparel",
  ],
  authors: [{ name: "Vonga" }],
  creator: "Vonga",
  publisher: "Vonga",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: `${baseUrl}/images/logos/Vonga Sq Logo - White - 512px.png`,
        width: 512,
        height: 512,
        alt: "Vonga Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [`${baseUrl}/images/logos/Vonga Sq Logo - White - 512px.png`],
    creator: "@vonga",
  },
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
  verification: {
    // Add Google Search Console verification when available
    // google: "verification-code",
  },
};

// JSON-LD Schema for Organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Vonga",
  url: baseUrl,
  logo: `${baseUrl}/images/logos/logo.svg`,
  description: defaultDescription,
  sameAs: [
    // Add social media links when available
    // "https://twitter.com/vonga",
    // "https://linkedin.com/company/vonga",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    email: "hello@vonga.io",
  },
};

// JSON-LD Schema for Product/Service
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Vonga Connected Apparel Platform",
  description: "NFC-enabled team apparel platform that creates meaningful fan experiences without requiring app downloads. Turn moments into experiences through connected merchandise.",
  brand: {
    "@type": "Brand",
    name: "Vonga",
  },
  category: "Sports Technology",
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "1",
  },
};

// JSON-LD Schema for WebSite
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Vonga",
  url: baseUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${baseUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
