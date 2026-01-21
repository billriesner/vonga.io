"use client";

import { CTAButton } from "@/components/layout/CTAButton";
import { motion } from "framer-motion";

interface HeroProps {
  headline: string;
  subhead: string;
  primaryCTA: {
    text: string;
    href: string;
    subtext?: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  backgroundVideo?: string;
  backgroundImage?: string;
}

export function Hero({
  headline,
  subhead,
  primaryCTA,
  secondaryCTA,
  backgroundVideo,
  backgroundImage,
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        ) : backgroundImage ? (
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy via-navy/90 to-navy/80" />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-navy/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          {headline}
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          {subhead}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          <div className="flex flex-col items-center gap-2">
            <CTAButton
              text={primaryCTA.text}
              href={primaryCTA.href}
              variant="coral"
              size="lg"
            />
            {primaryCTA.subtext && (
              <p className="text-sm text-white/80 text-center max-w-xs">
                {primaryCTA.subtext}
              </p>
            )}
          </div>
          {secondaryCTA && (
            <CTAButton
              text={secondaryCTA.text}
              href={secondaryCTA.href}
              variant="outline"
              size="lg"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
