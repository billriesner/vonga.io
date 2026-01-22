import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { CategoryDefinition } from "@/components/sections/CategoryDefinition";
import { VideoDemo } from "@/components/sections/VideoDemo";
import { ExperienceTypes } from "@/components/sections/ExperienceTypes";
import { Partnership } from "@/components/sections/Partnership";
import { TrustSection } from "@/components/sections/TrustSection";
import { LeadForm } from "@/components/sections/LeadForm";

import { homepage } from "@/content/homepage";
import { experienceTypes } from "@/content/experience-types";
import { trustStatements } from "@/content/trust-statements";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vonga.io";

export const metadata: Metadata = {
  title: "Create Experiences That Matter Through NFC-Enabled Team Apparel",
  description: "Turn moments into experiences with NFC-enabled team apparel. Create meaningful fan connections, unlock exclusive content, and build lasting belonging—no app required. The experience platform for sports teams, universities, and communities.",
  keywords: [
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
    "NFC team apparel",
    "connected sports merchandise",
    "interactive team apparel",
    "fan connection platform",
    "sports fan experiences",
  ],
  openGraph: {
    title: "Vonga | Create Experiences That Matter Through Connected Apparel",
    description: "Turn moments into experiences with NFC-enabled team apparel. Create meaningful fan connections without requiring app downloads.",
    url: baseUrl,
    siteName: "Vonga",
    images: [
      {
        url: `${baseUrl}/images/logos/Vonga Sq Logo - White - 512px.png`,
        width: 512,
        height: 512,
        alt: "Vonga - NFC-Enabled Team Apparel Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vonga | Create Experiences That Matter",
    description: "NFC-enabled team apparel that creates meaningful fan experiences—no app required.",
    images: [`${baseUrl}/images/logos/Vonga Sq Logo - White - 512px.png`],
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function HomePage() {
  return (
    <>
      <Header transparent />
      
      <main>
        {/* 1. Hero: Hook + positioning + primary CTA */}
        <Hero
          headline={homepage.hero.headline}
          subhead={homepage.hero.subhead}
          primaryCTA={homepage.hero.primaryCTA}
          secondaryCTA={homepage.hero.secondaryCTA}
          backgroundVideo="/videos/hero-video.mp4"
        />

        {/* 2. Problem: Dormant Asset Problem */}
        <ProblemSection
          headline={homepage.problem.headline}
          description={homepage.problem.description}
          statement={homepage.problem.statement}
        />

        {/* 3. Category Definition: What Vonga is */}
        <CategoryDefinition
          categoryName={homepage.category.categoryName}
          translation={homepage.category.translation}
          explanation={homepage.category.explanation}
          proofMechanism={homepage.category.proofMechanism}
          context={homepage.category.context}
        />

        {/* 5. Video Demo: Product demo video */}
        <VideoDemo
          headline={homepage.video.headline}
          description={homepage.video.description}
          videoUrl="/videos/demo-video.mp4"
          caption={homepage.video.caption}
        />

        {/* 5. Experience Gateway: Transform apparel into fan experiences */}
        <ExperienceTypes
          experiences={experienceTypes}
        />

        {/* 6. Partnership: Revenue-first approach */}
        <Partnership
          headline={homepage.partnership.headline}
          subhead={homepage.partnership.subhead}
          points={homepage.partnership.points}
        />

        {/* 7. Trust: Risk removal statements */}
        <TrustSection
          headline="Built on Trust"
          statements={trustStatements}
        />

        {/* 8. Lead Form: Primary conversion point */}
        <LeadForm
          headline={homepage.form.headline}
          subhead={homepage.form.subhead}
          privacyNote={homepage.form.privacyNote}
          successMessage={homepage.form.successMessage}
          errorMessage={homepage.form.errorMessage}
          nextSteps={homepage.form.nextSteps}
        />
      </main>

      <Footer />
    </>
  );
}
