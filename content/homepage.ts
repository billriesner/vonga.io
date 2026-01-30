/**
 * Homepage Copy - Single Source of Truth
 * Strategic positioning: Outcome-Focused Revenue Platform
 * Focus on measurable ROI, fan data, and repeat revenue
 * Updated: 2026-01-30 - Approved messaging framework
 */

export const homepage = {
  hero: {
    headline: "Prove Sponsor ROI. Build Your Fan Database. Drive Repeat Revenue.",
    subhead: "Turn team apparel into measurable fan engagement without apps, QR codes, or personal data collection.",
    primaryCTA: {
      text: "Request a Demo",
      href: "#contact"
    },
    secondaryCTA: {
      text: "See How It Works",
      href: "#video"
    }
  },

  problem: {
    headline: "Your Sponsors Need Proof. You Need Data.",
    description: "Sponsors demand engagement metrics. 'Impressions' and 'reach' don't cut it anymore. They want proof their activation drove fan behavior.",
    statement: "Without measurable data, you can't justify renewals or premium pricing."
  },


  category: {
    categoryName: "Complete Engagement Solution",
    translation: "Premium NFC apparel + measurable engagement platform + proven results.",
    explanation: "We're not 'Intel Inside' for Nike. We're a complete solution: premium apparel, NFC technology, analytics platform, and implementation support—all from one partner.",
    proofMechanism: "Track exact engagement (who tapped, when, where). Measure activation effectiveness. Deliver sponsor reports with real behavioral data. Prove ROI with numbers, not estimates.",
    context: "No app required. No QR codes. No personal data collection. Just fans engaging with apparel they already wear."
  },

  video: {
    headline: "See Vonga in Action",
    description: "Watch how teams create experiences, fans engage, and operators measure results—all without apps, QR codes, or complicated setup.",
    placeholderText: "Demo video coming soon - showing the complete operator and fan journey",
    caption: "From creation to engagement to measurement in under 60 seconds"
  },

  diy: {
    headline: "Why Not Just Buy NFC Tags Separately?",
    description: "Some teams think they can DIY with generic NFC tech. Here's why that doesn't work:",
    limitations: [
      {
        problem: "You'd need to source apparel separately",
        solution: "We provide premium apparel + NFC in one solution"
      },
      {
        problem: "You'd coordinate NFC programming yourself",
        solution: "We handle all programming and content setup"
      },
      {
        problem: "You'd build analytics from scratch",
        solution: "We provide dashboards ready day one"
      },
      {
        problem: "DIY takes 3-6 months of project management",
        solution: "Turnkey implementation in 10 weeks, we manage everything"
      }
    ],
    conclusion: "We're not 'Intel Inside' for another brand—we're the complete solution. One partner, one invoice, proven results in sports."
  },

  partnership: {
    headline: "Built for Teams, Not Tech Companies",
    subhead: "We're the official kit provider for teams overlooked by big brands. This isn't self-service software—it's white-glove partnership from design to launch to ongoing optimization.",
    points: [
      "Starter Tier: Low-risk pilot starting at 500 garments—enough to prove value without huge commitment",
      "Turnkey Implementation: 10 weeks from signature to launch, we handle everything",
      "White-Glove Support: Dedicated onboarding, content strategy, team training included",
      "Annual Savings: Save 20% with annual billing vs monthly payments",
      "You Control Everything: Your brand, your domain, your fan relationships—we just provide the infrastructure"
    ]
  },

  form: {
    headline: "Ready to Turn Apparel Into Revenue?",
    subhead: "See how Vonga can help your team prove sponsor ROI, build your fan database, and drive repeat revenue. Limited 2026 implementation slots available.",
    privacyNote: "We respect your privacy. Your information will only be used to follow up on your inquiry.",
    successMessage: "Thanks! We'll be in touch within 24 hours to schedule your demo and discuss how Vonga can solve your specific challenges.",
    errorMessage: "Something went wrong. Please try again or email us directly at hello@vonga.io",
    nextSteps: [
      "15-minute discovery call to understand your goals",
      "Custom proposal with Starter Tier pricing",
      "Design mockups for your team apparel",
      "Launch in 10 weeks from signature"
    ]
  },

  footerCTA: {
    headline: "Stop guessing. Start measuring. Prove sponsor ROI with every garment sold.",
    ctaText: "Request a Demo",
    ctaHref: "#contact"
  },

  riskReversal: {
    headline: "Low Risk, High ROI",
    points: [
      "Start Small: Starter Tier at 500 garments—enough to prove value, small enough to be manageable",
      "Fast Launch: 10 weeks from contract to live engagement data",
      "Proven Results: 40-60% average engagement rate (vs 1-2% for social media posts)",
      "No Lock-In: Annual contracts, expand when results justify it",
      "Annual Savings: Lock in 20% discount with annual billing vs monthly"
    ]
  }
} as const;
