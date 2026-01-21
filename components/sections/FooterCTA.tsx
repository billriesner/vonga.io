"use client";

import { CTAButton } from "@/components/layout/CTAButton";

interface FooterCTAProps {
  headline: string;
  ctaText?: string;
  ctaHref?: string;
}

export function FooterCTA({
  headline,
  ctaText = "Let's Connect",
  ctaHref = "#contact",
}: FooterCTAProps) {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-aqua to-coral" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
          {headline}
        </h2>
        <CTAButton
          text={ctaText}
          href={ctaHref}
          variant="secondary"
          size="lg"
        />
      </div>
    </section>
  );
}
