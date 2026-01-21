/**
 * Experience-First Framework
 * Shows what teams can CREATE (experiences) → drives engagement → drives revenue
 * Apparel becomes the gateway to fan experiences
 */

export interface ExperienceType {
  id: string;
  icon: string; // Lucide icon name
  title: string;
  description: string; // What it enables
  examples: string; // Specific use cases
  benefit: string; // How it drives revenue/engagement
}

export const experienceTypes: ExperienceType[] = [
  {
    id: "geofenced",
    icon: "MapPin",
    title: "Geofenced Experiences",
    description: "Turn any location into a fan activation.",
    examples: "Reward fans for coming to games. Host sponsored watch parties. Drive traffic to sponsor locations. Track attendance and reward participation.",
    benefit: "Location-based engagement increases visit frequency and purchase intent at key moments."
  },
  {
    id: "timebound",
    icon: "Clock",
    title: "Timebound Experiences",
    description: "Create moments where your global fandom comes together.",
    examples: "Unite fans during the big game. Virtual celebrations. Community gatherings. Track who attends and reward their participation.",
    benefit: "Moment-based activation captures fans at peak excitement, driving higher engagement."
  },
  {
    id: "content-channel",
    icon: "Lock",
    title: "Exclusive Content Channel",
    description: "Give wearers access to content only available via Vonga.",
    examples: "Coach and player messages. Previews of upcoming drops. Behind-the-scenes content. Build a measurable community of top fans.",
    benefit: "Ongoing content access keeps fans engaged between events, increasing shopping frequency 2.8×."
  },
  {
    id: "sponsor-platform",
    icon: "TrendingUp",
    title: "Sponsor Platform",
    description: "Extend all capabilities to team sponsors.",
    examples: "Sponsor location visits. Direct messages to top fans. Exclusive prizes and discounts. All measurable via the platform.",
    benefit: "Sponsor activations create new revenue streams while deepening fan engagement."
  }
] as const;
