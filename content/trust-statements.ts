/**
 * Trust Statements - Risk Removal
 * All 7 must appear on homepage
 */

export interface TrustStatement {
  id: string;
  text: string;
  description: string;
  icon: string; // Lucide icon name
}

export const trustStatements: TrustStatement[] = [
  {
    id: "no-pii",
    text: "No personal data collected",
    description: "Privacy-first approach. Fans stay anonymous unless they choose otherwise.",
    icon: "Shield"
  },
  {
    id: "no-app",
    text: "No app required",
    description: "Zero friction for fans. Works with any NFC-enabled phone.",
    icon: "Smartphone"
  },
  {
    id: "no-qr",
    text: "No QR codes",
    description: "Pure NFC, no compromises. Better experience, more secure.",
    icon: "XCircle"
  },
  {
    id: "permanent",
    text: "Permanent, wash-tested tags",
    description: "Built to last. No maintenance or replacements required.",
    icon: "CheckCircle2"
  },
  {
    id: "secure",
    text: "Cannot be cloned",
    description: "Secure by design. Each tag is unique and cryptographically signed.",
    icon: "Lock"
  },
  {
    id: "team-controlled",
    text: "Team-controlled experiences",
    description: "You own the relationship. Full control over what fans access.",
    icon: "Settings"
  },
  {
    id: "flexible-hosting",
    text: "Your domain or ours",
    description: "Experience can be hosted on your team domain or Vonga. Your brand, your choice.",
    icon: "Globe"
  }
] as const;
