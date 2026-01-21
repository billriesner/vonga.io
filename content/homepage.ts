/**
 * Homepage Copy - Single Source of Truth
 * Strategic positioning: Revenue-Generating Apparel (not engagement platform)
 * Based on verified research and competitive moat
 */

export const homepage = {
  hero: {
    headline: "Turn Team Apparel Into a Revenue-Generating Asset",
    subhead: "Make apparel a year-round engagement channel. Deepen fan relationships. Grow revenue per fan.",
    primaryCTA: {
      text: "Schedule a Call",
      href: "#contact"
    },
    secondaryCTA: {
      text: "See How It Works",
      href: "#video"
    }
  },

  problem: {
    headline: "The Dormant Asset Problem",
    description: "Fans engage with your team 100+ times per year. Revenue happens at 3-5 events. That gap is your opportunity.",
    statement: "Turn year-round engagement into year-round revenue."
  },


  category: {
    categoryName: "Apparel-as-a-Channel",
    translation: "A revenue channel that works 365 days a year, delivered through team kits.",
    explanation: "Most teams sell apparel once. We turn it into ongoing revenue. Your kit knows where fans are and unlocks the right offer at the right time.",
    proofMechanism: "Engaged customers shop 2.8× more often and spend 4.3× more. Vonga delivers that through apparel fans already wear.",
    context: "No app to download. No algorithm to fight. No spam filters. Just fans wearing your kit."
  },

  video: {
    headline: "See It In Action",
    description: "Watch how Vonga creates ongoing fan engagement and measurable revenue opportunities through premium team apparel.",
    placeholderText: "Demo video coming soon",
    caption: "60-second demo showing fan experience and team dashboard"
  },

  diy: {
    headline: "Why Not QR Codes and a Loyalty App?",
    description: "Some teams try QR codes, loyalty apps, and social media. Here's why that doesn't work:",
    limitations: [
      {
        problem: "QR codes wash off",
        solution: "Our NFC tags last 3+ years without replacement"
      },
      {
        problem: "Loyalty apps require downloads fans won't bother with",
        solution: "Vonga requires no app; fans already have the kit"
      },
      {
        problem: "Social media is rented attention you don't control",
        solution: "Apparel is an owned channel (no algorithm changes)"
      },
      {
        problem: "None of them know WHERE your fan is",
        solution: "Vonga enables location-aware revenue (the moat)"
      }
    ],
    conclusion: "Vonga is the only platform that turns apparel into a permanent, location-aware revenue channel. Early movers are already capturing this advantage."
  },

  partnership: {
    headline: "How We Work Together",
    subhead: "From design to launch to ongoing optimization, we partner with you to create the fan experiences that drive engagement and revenue.",
    points: [
      "Collaborative design: Your brand, our platform",
      "Fast launch: As little as 6-8 weeks for standard programs",
      "Low-risk pilot: Start with 300 kits, scale when ready",
      "Continuous improvement: Optimize based on real fan data",
      "Limited 2026 spots: Early partners lock in pricing"
    ]
  },

  form: {
    headline: "Ready to Increase Revenue Per Fan?",
    subhead: "Tell us about your team. We'll show you exactly how Vonga fits your goals. Limited 2026 pilot spots available.",
    privacyNote: "We respect your privacy. Your information will only be used to follow up on your inquiry.",
    successMessage: "Thanks for reaching out! We'll be in touch within 24 hours to discuss how Vonga can help your team.",
    errorMessage: "Something went wrong. Please try again or email us directly at hello@vonga.io",
    nextSteps: [
      "Quick call (15 min) to understand your goals",
      "Custom pilot plan with pricing",
      "Design mockups for your team kits",
      "Launch in 6-8 weeks"
    ]
  },

  footerCTA: {
    headline: "Your fans wear your kit 100+ times a year. Start earning revenue every time.",
    ctaText: "Schedule a Call",
    ctaHref: "#contact"
  },

  riskReversal: {
    headline: "Proven Revenue Model, Not Experiment",
    points: [
      "Engaged customers shop 2.8× more often and spend 4.3× more",
      "Repeat buyers in sports spend 2-4× more than one-time purchasers",
      "Pilot programs start at 100 kits with full platform access",
      "Launch in 6-8 weeks from approval",
      "Early partners get pricing locked for 2026-2027 seasons"
    ]
  }
} as const;
