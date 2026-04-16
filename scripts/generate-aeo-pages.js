#!/usr/bin/env node
/**
 * AEO (Answer Engine Optimization) Page Generator
 * Generates answer pages optimized for AI search results
 * 
 * Part of BRICK-SPRINT-APR7-11 V5: SEO Infrastructure
 */

const fs = require('fs');
const path = require('path');

// ────────────────────────────────────────────────────────────────────────────────
// AEO TOPICS
// ────────────────────────────────────────────────────────────────────────────────

const AEO_PAGES = [
  {
    slug: 'what-is-fan-intelligence',
    title: 'What is Fan Intelligence?',
    description: 'Fan intelligence is the practice of collecting, analyzing, and acting on fan behavior data to improve engagement, personalization, and sponsor ROI.',
    question: 'What is fan intelligence?',
    answer: 'Fan intelligence is the systematic collection and analysis of fan behavior data to understand who your fans are, how they engage, and what drives their loyalty. It combines first-party data from ticketing, apps, merchandise, and digital interactions to create unified fan profiles. These profiles power personalization, inform sponsorship valuations, and enable targeted communications.'
  },
  {
    slug: 'sports-sponsorship-trends-2026',
    title: 'Sports Sponsorship Trends 2026',
    description: 'Key sports sponsorship trends for 2026 include digital-first activation, measurable ROI, data sharing, and NFC/contactless experiences.',
    question: 'What are the top sports sponsorship trends in 2026?',
    answer: 'The top sports sponsorship trends in 2026 are: 1) Digital-first activation — sponsors demand trackable experiences over passive signage, 2) ROI measurement — real-time dashboards showing engagement and attribution, 3) Data sharing — teams providing sponsors with first-party audience insights, 4) NFC/contactless — embedded experiences in merchandise and venues, 5) Sustainability — eco-friendly activations and carbon offset programs, 6) Fan data as currency — sponsorship packages priced based on verified audience value.'
  },
  {
    slug: 'how-nfc-tags-work',
    title: 'How NFC Tags Work',
    description: 'NFC tags are small chips that communicate with smartphones via radio frequency. When tapped, they trigger actions like opening URLs or apps.',
    question: 'How do NFC tags work?',
    answer: 'NFC (Near Field Communication) tags are passive chips that store small amounts of data and communicate via radio frequency when powered by a reader device (like a smartphone). The chip contains an antenna and memory (typically 48 bytes to 8KB). When a phone is held within 4cm, the phone\'s NFC reader powers the chip through electromagnetic induction, reads the stored data (usually a URL), and triggers an action. No batteries required in the tag — it\'s powered by the phone.'
  },
  {
    slug: 'sports-marketing-technology-stack',
    title: 'Sports Marketing Technology Stack',
    description: 'The modern sports marketing tech stack includes CRM, ticketing, mobile apps, data platforms, NFC/IoT, and analytics dashboards.',
    question: 'What technology do sports teams use for marketing?',
    answer: 'Modern sports marketing tech stacks typically include: CRM platforms (Salesforce, Microsoft Dynamics) for fan profiles and communications, ticketing systems (Ticketmaster, Paciolan) for purchase data, mobile apps for engagement and location data, Customer Data Platforms (CDPs) for profile unification, email/SMS platforms (Sailthru, Braze) for campaigns, social media management tools, analytics dashboards for insights, and increasingly NFC/IoT platforms for physical-to-digital fan engagement.'
  },
  {
    slug: 'digital-sponsorship-activation-ideas',
    title: 'Digital Sponsorship Activation Ideas',
    description: 'Digital sponsorship activations include NFC experiences, AR filters, mobile games, exclusive content unlocks, and real-time contests.',
    question: 'What are good digital sponsorship activation ideas?',
    answer: 'Effective digital sponsorship activations include: 1) NFC-powered product experiences — tap merchandise to unlock sponsor content, 2) AR filters and effects — branded camera experiences on social, 3) Mobile games and contests — real-time participation during games, 4) Exclusive content gating — sponsor-unlocked videos or interviews, 5) Loyalty point multipliers — sponsor-branded earning opportunities, 6) QR code treasure hunts — in-venue engagement with prizes, 7) Second-screen experiences — synchronized content during broadcasts.'
  },
  {
    slug: 'fan-engagement-metrics',
    title: 'Fan Engagement Metrics That Matter',
    description: 'Key fan engagement metrics include tap/interaction rates, dwell time, content completion, sharing, and conversion to purchase or action.',
    question: 'What metrics should sports teams track for fan engagement?',
    answer: 'Essential fan engagement metrics include: 1) Interaction rate — percentage of fans who engage vs. total audience, 2) Dwell time — how long fans spend with content, 3) Content completion — video watch percentage, experience completion, 4) Share rate — content shared to social or friends, 5) Return rate — fans who engage multiple times, 6) Conversion — actions taken (purchase, signup, app download), 7) Net Promoter Score — willingness to recommend, 8) First-party data capture rate — fans who provide contact info.'
  },
  {
    slug: 'qr-code-vs-nfc-sports',
    title: 'QR Code vs NFC for Sports Marketing',
    description: 'Compare QR codes and NFC tags for sports marketing. NFC offers higher engagement but higher cost; QR is cheaper but lower interaction rates.',
    question: 'Should sports teams use QR codes or NFC?',
    answer: 'QR codes and NFC serve different purposes. QR codes are cheap (just print them), work anywhere, but see 2-5% scan rates and require camera app. NFC costs more ($0.10-2.00/chip) but sees 60-70% engagement rates when embedded in products fans already use. Best practice: use QR for mass-printed materials and signage, use NFC for premium merchandise and VIP experiences where higher engagement justifies the cost.'
  }
];

// ────────────────────────────────────────────────────────────────────────────────
// PAGE TEMPLATE
// ────────────────────────────────────────────────────────────────────────────────

function generateAEOPage(page) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title} | Vonga</title>
    <meta name="description" content="${page.description}">
    <link rel="canonical" href="https://vonga.io/answers/${page.slug}">
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "${page.question}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "${page.answer.replace(/"/g, '\\"')}"
          }
        }
      ]
    }
    </script>
    
    <style>
      :root {
        --color-bg: #0a1628;
        --color-surface: #1a2234;
        --color-border: #2a3548;
        --color-text: #ffffff;
        --color-text-secondary: #94a3b8;
        --color-accent: #33BECC;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: var(--color-bg);
        color: var(--color-text);
        line-height: 1.8;
      }
      .container { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
      .header { padding: 1rem 0; border-bottom: 1px solid var(--color-border); }
      .logo { color: var(--color-accent); font-size: 1.5rem; font-weight: 700; text-decoration: none; }
      article { padding: 3rem 0; }
      h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.2; }
      .subtitle { color: var(--color-text-secondary); font-size: 1.125rem; margin-bottom: 2rem; }
      p { margin-bottom: 1rem; }
      .answer-box {
        background: linear-gradient(135deg, rgba(51, 190, 204, 0.1), rgba(51, 190, 204, 0.05));
        border: 1px solid var(--color-accent);
        border-radius: 1rem;
        padding: 2rem;
        margin: 2rem 0;
      }
      .answer-box h2 { color: var(--color-accent); margin-top: 0; margin-bottom: 1rem; font-size: 1.25rem; }
      .cta {
        text-align: center;
        padding: 3rem;
        background: var(--color-surface);
        border-radius: 1rem;
        margin: 2rem 0;
      }
      .cta h3 { margin-bottom: 1rem; }
      .cta-button {
        display: inline-block;
        padding: 1rem 2rem;
        background: var(--color-accent);
        color: var(--color-bg);
        font-weight: 600;
        text-decoration: none;
        border-radius: 0.5rem;
      }
      .related {
        padding: 2rem;
        background: var(--color-surface);
        border-radius: 1rem;
        margin: 2rem 0;
      }
      .related h3 { margin-bottom: 1rem; font-size: 1rem; color: var(--color-text-secondary); }
      .related a { color: var(--color-accent); text-decoration: none; display: block; padding: 0.5rem 0; }
      .related a:hover { text-decoration: underline; }
      .footer { padding: 2rem 0; border-top: 1px solid var(--color-border); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <a href="/" class="logo">VONGA</a>
        </div>
    </header>
    
    <article>
        <div class="container">
            <h1>${page.title}</h1>
            <p class="subtitle">${page.description}</p>
            
            <div class="answer-box">
                <h2>Quick Answer</h2>
                <p>${page.answer}</p>
            </div>
            
            <div class="cta">
                <h3>Want to Learn More?</h3>
                <p>See how Vonga helps sports teams and sponsors with fan engagement.</p>
                <a href="/contact.html" class="cta-button">Book a Demo →</a>
            </div>
            
            <div class="related">
                <h3>Related Questions</h3>
                <a href="/answers/what-is-nfc-in-sports-marketing">What is NFC in Sports Marketing?</a>
                <a href="/answers/how-to-measure-sponsorship-roi">How to Measure Sponsorship ROI</a>
                <a href="/answers/first-party-fan-data-explained">First-Party Fan Data Explained</a>
            </div>
        </div>
    </article>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2026 Vonga. <a href="/answers" style="color: var(--color-accent);">More Answers</a></p>
        </div>
    </footer>
</body>
</html>`;
}

function generateIndexPage() {
  const allPages = [
    { slug: 'what-is-nfc-in-sports-marketing', title: 'What is NFC in Sports Marketing?' },
    { slug: 'how-to-measure-sponsorship-roi', title: 'How to Measure Sponsorship ROI' },
    { slug: 'first-party-fan-data-explained', title: 'First-Party Fan Data Explained' },
    ...AEO_PAGES
  ];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sports Marketing Answers | Vonga</title>
    <meta name="description" content="Expert answers to common sports marketing questions. NFC, sponsorship ROI, fan data, and more.">
    <link rel="canonical" href="https://vonga.io/answers">
    <style>
      :root {
        --color-bg: #0a1628;
        --color-surface: #1a2234;
        --color-border: #2a3548;
        --color-text: #ffffff;
        --color-text-secondary: #94a3b8;
        --color-accent: #33BECC;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: var(--color-bg);
        color: var(--color-text);
        line-height: 1.6;
      }
      .container { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
      .header { padding: 1rem 0; border-bottom: 1px solid var(--color-border); }
      .logo { color: var(--color-accent); font-size: 1.5rem; font-weight: 700; text-decoration: none; }
      .hero { padding: 4rem 0; text-align: center; }
      .hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
      .hero p { color: var(--color-text-secondary); }
      .answers-list { padding: 2rem 0; }
      .answer-link {
        display: block;
        padding: 1.5rem;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;
        color: var(--color-text);
        text-decoration: none;
        margin-bottom: 1rem;
        transition: border-color 0.2s;
      }
      .answer-link:hover { border-color: var(--color-accent); }
      .answer-link h2 { font-size: 1.125rem; margin-bottom: 0.25rem; }
      .answer-link p { color: var(--color-text-secondary); font-size: 0.875rem; margin: 0; }
      .footer { padding: 2rem 0; border-top: 1px solid var(--color-border); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <a href="/" class="logo">VONGA</a>
        </div>
    </header>
    <section class="hero">
        <div class="container">
            <h1>Sports Marketing Answers</h1>
            <p>Expert answers to your questions about NFC, sponsorship, and fan engagement</p>
        </div>
    </section>
    <section class="answers-list">
        <div class="container">
            ${allPages.map(p => `<a href="/answers/${p.slug}" class="answer-link">
                <h2>${p.title}</h2>
            </a>`).join('\n            ')}
        </div>
    </section>
    <footer class="footer">
        <div class="container">
            <p>&copy; 2026 Vonga. <a href="/" style="color: var(--color-accent);">Home</a></p>
        </div>
    </footer>
</body>
</html>`;
}

// ────────────────────────────────────────────────────────────────────────────────
// GENERATE
// ────────────────────────────────────────────────────────────────────────────────

const answersDir = path.join(__dirname, '..', 'answers');
fs.mkdirSync(answersDir, { recursive: true });

let count = 0;
for (const page of AEO_PAGES) {
  const filePath = path.join(answersDir, `${page.slug}.html`);
  fs.writeFileSync(filePath, generateAEOPage(page), 'utf8');
  console.log(`✓ Generated: /answers/${page.slug}`);
  count++;
}

// Generate index
fs.writeFileSync(path.join(answersDir, 'index.html'), generateIndexPage(), 'utf8');
console.log('✓ Generated: /answers/index.html');

console.log(`\n✅ Generated ${count} AEO pages + index`);
