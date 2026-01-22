/**
 * Homepage Copy - Single Source of Truth
 * Strategic positioning: Experience-Focused Connection Platform
 * Focus on creating meaningful experiences that build belonging and connection
 */

export const homepage = {
  hero: {
    headline: "Turn Moments Into Experiences",
    subhead: "Make apparel a year-round connection channel. Create meaningful fan experiences. Build lasting belonging.",
    primaryCTA: {
      text: "Let's Connect",
      href: "#contact"
    },
    secondaryCTA: {
      text: "See How It Works",
      href: "#video"
    }
  },

  problem: {
    headline: "The Connection Gap",
    description: "Fans wear your apparel 100+ times per year. But most moments pass without connection. That gap is your opportunity.",
    statement: "Turn every moment into a meaningful experience."
  },


  category: {
    categoryName: "Apparel-as-a-Connection",
    translation: "A connection channel that works 365 days a year, delivered through team kits.",
    explanation: "Most teams sell apparel once. We turn it into ongoing connection. Your kit knows where fans are and unlocks the right experience at the right moment.",
    proofMechanism: "Connected fans feel seen, stay loyal, and become advocates. Vonga delivers that through apparel fans already wear.",
    context: "No app to download. No algorithm to fight. No spam filters. Just fans wearing your kit."
  },

  video: {
    headline: "See It In Action",
    description: "Watch how Vonga turns moments into experiences. See how fans unlock exclusive content and how teams create meaningful connections through premium apparel.",
    placeholderText: "Demo video coming soon",
    caption: ""
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
    subhead: "From design to launch to ongoing optimization, we partner with you to create the fan experiences that build connection and belonging.",
    points: [
      "Collaborative design: Your brand, our platform",
      "Fast launch: As little as 6-8 weeks for standard programs",
      "Low-risk pilot: Start with 300 kits, scale when ready",
      "Continuous improvement: Optimize based on real fan engagement",
      "Limited 2026 spots: Early partners lock in pricing"
    ]
  },

  form: {
    headline: "Ready to Create Experiences That Matter?",
    subhead: "Tell us about your team. We'll show you exactly how Vonga helps you connect with fans in meaningful ways. Limited 2026 pilot spots available.",
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
    headline: "Your fans wear your kit 100+ times a year. Start creating experiences every time.",
    ctaText: "Let's Connect",
    ctaHref: "#contact"
  },

  riskReversal: {
    headline: "Proven Connection Platform, Not Experiment",
    points: [
      "Connected fans feel seen and stay loyal",
      "Meaningful experiences build lasting relationships",
      "Pilot programs start at 100 kits with full platform access",
      "Launch in 6-8 weeks from approval",
      "Early partners get pricing locked for 2026-2027 seasons"
    ]
  }
} as const;
