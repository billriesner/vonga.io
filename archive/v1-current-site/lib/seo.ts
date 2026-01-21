export const SITE = {
  name: "Vonga",
  domain: "https://vonga.io",
  twitter: "@vonga",
  description:
    "Vonga turns apparel into living digital experiences — connecting fans, students, and members through on-body moments you can see, feel, and measure.",
};

export const DEFAULT_TITLE = "Vonga | Connected Apparel & On-Body Engagement";
export const DEFAULT_DESCRIPTION =
  "Turn emotion into connection that lasts. Vonga powers on-body experiences for sports teams, universities, studios & clubs, and creators.";

export const PAGE_SEO = {
  "/": {
    title: "Connected Apparel & On-Body Engagement Platform | Vonga",
    description:
      "Vonga turns apparel into living digital experiences — connecting fans, students, and members through emotion, not just transactions.",
  },
  "/how-it-works": {
    title: "How Vonga Works | NFC Apparel Experiences, No App Required",
    description:
      "See how NFC-enabled apparel triggers branded mobile experiences, measurable engagement, and lasting connection. Fast, secure, and human-centered.",
  },
  "/solutions/sports-teams": {
    title: "Vonga for Sports Teams | Fan Engagement That Lasts All Season",
    description:
      "Extend game-day energy beyond the arena. Turn passion into loyalty with interactive apparel experiences and measurable engagement.",
  },
  "/sports-teams": {
    title: "Vonga for Sports Teams | Fan Engagement That Lasts All Season",
    description:
      "Extend game-day energy beyond the arena. Turn passion into loyalty with interactive apparel experiences and measurable engagement.",
  },
  "/solutions/schools": {
    title: "Vonga for Schools & Universities | Pride That Endures",
    description:
      "Carry school identity into daily life. Connect students and alumni through wearable experiences, rewards, and moments that last.",
  },
  "/schools": {
    title: "Vonga for Schools & Universities | Pride That Endures",
    description:
      "Carry school identity into daily life. Connect students and alumni through wearable experiences, rewards, and moments that last.",
  },
  "/solutions/studios-clubs": {
    title: "Vonga for Studios & Clubs | Member Belonging Beyond the Property",
    description:
      "Transform access and apparel into continuity. Build membership identity that travels with your community — every day.",
  },
  "/studios-clubs": {
    title: "Vonga for Studios & Clubs | Member Belonging Beyond the Property",
    description:
      "Transform access and apparel into continuity. Build membership identity that travels with your community — every day.",
  },
  "/solutions/creators": {
    title: "Vonga for Creators & Communities | From Viral to Enduring",
    description:
      "Turn fleeting hype into lasting connection. Give your people a way to carry membership, meaning, and belonging.",
  },
  "/creators": {
    title: "Vonga for Creators & Communities | From Viral to Enduring",
    description:
      "Turn fleeting hype into lasting connection. Give your people a way to carry membership, meaning, and belonging.",
  },
  "/intake": {
    title: "Let's Connect | Start Your Vonga Pilot",
    description:
      "Tell us your goals and launch a pilot. We'll help you design an on-body experience your audience can feel — and you can measure.",
  },
  "/about": {
    title: "About Vonga | Our Mission & Vision",
    description:
      "Learn about Vonga's mission to make everyday apparel a gateway to connection, experiences, and rewards. Privacy-first, community-driven, quality-obsessed.",
  },
} as const;

export function metaFor(pathname: string) {
  return PAGE_SEO[pathname as keyof typeof PAGE_SEO] ?? {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  };
}

export function canonical(pathname: string) {
  const clean = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  return `${SITE.domain}${clean}`;
}

export const GLOSSARY = [
  { term: "Connected apparel", def: "Clothing embedded with NFC that triggers a branded mobile experience on tap." },
  { term: "On-body engagement", def: "Real-world interactions initiated from what a person wears, measured without losing the human moment." },
  { term: "Mobile experience", def: "A fast, branded page that opens on tap — no app required — enabling check-ins, drops, raffles, or perks." },
  { term: "Geofenced check-in", def: "A scan validated by location to reward verified attendance at events or venues." },
  { term: "Time-bound drop", def: "A limited window activation that creates urgency for rewards or access." },
  { term: "Redeemable perks", def: "Offers unlocked by tapping, tied to the item and its campaigns." },
  { term: "Sponsor activation", def: "A partner moment triggered by apparel interaction with measurable engagement data." },
];

