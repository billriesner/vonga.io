'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Link as LinkIcon, Smartphone, Zap, BarChart3, RefreshCw } from 'lucide-react';
import SEO from '@/components/SEO';
// --- Vonga: See How It Works — Final FAQ Set (no QR fallback) ---

const FAQS_BY_CATEGORY = [
  {
    category: 'How It Works',
    items: [
      {
        q: 'Do people need an app?',
        a: "No. A simple tap opens the experience directly in the phone's browser. No app download or installation required.",
      },
      {
        q: 'Does it work on iPhone and Android?',
        a: 'Yes. Most modern iPhones and Android phones support NFC natively. The experience loads in the standard mobile browser.',
      },
      {
        q: 'What happens when someone taps?',
        a: "The NFC tag opens a unique, cryptographically signed link. Your branded mobile experience loads instantly, allowing fans or members to join, check in, enter raffles, or redeem perks.",
      },
      {
        q: 'What kind of tags are used?',
        a: 'We use standards-based NFC NDEF chips, each with a unique, unclonable identifier. These are the same technology used in contactless payment systems.',
      },
      {
        q: 'Are the tags durable?',
        a: 'Yes. Each chip is wash-tested, temperature-tested, and positioned for long-term wear. Placement and adhesives are selected based on garment type and washing instructions.',
      },
      {
        q: 'Can tags be replaced or cloned?',
        a: "No. Once embedded, a tag is permanent. If it's damaged, the entire garment would need to be replaced. Every tag carries a cryptographically unique signature that cannot be copied or duplicated.",
      },
      {
        q: 'Will tags interfere with security scanners?',
        a: 'No. NFC tags are passive devices that do not broadcast signals or set off metal detectors or security scanners. They only activate when a phone is held very close.',
      },
      {
        q: 'Where does the mobile experience live?',
        a: 'We can host it for you or set it up under your domain. The experience loads in about three seconds on common networks and follows your brand kit and tone.',
      },
      {
        q: 'Is the experience accessible?',
        a: 'Yes. We follow accessibility guidelines for color, contrast, and controls. The interface is designed to work with screen readers and other assistive technologies.',
      },
    ],
  },
  {
    category: 'Data & Privacy',
    items: [
      {
        q: 'Do you collect personal data?',
        a: 'No. We do not collect or sell personal data. Participation can remain completely anonymous unless your campaign explicitly requests opt-in information.',
      },
      {
        q: 'Who owns the engagement data?',
        a: 'You do. We help you capture and visualize engagement data securely, but you maintain full ownership and control over all information collected.',
      },
      {
        q: 'What data is captured on scan?',
        a: 'Each scan captures time, location band, campaign ID, and item ID. No personal identifiers are collected unless your campaign explicitly requests opt-in consent from the user.',
      },
      {
        q: 'Can we delete data?',
        a: 'Yes. Data management and retention are under your control. You can delete individual records or entire datasets through the dashboard or API.',
      },
    ],
  },
  {
    category: 'Campaigns & Capabilities',
    items: [
      {
        q: 'What types of activations are available?',
        a: 'You can launch geofenced check-ins, time-bound drops, raffles and giveaways, and redeemable perks. Campaign rules let you customize timing, location, and user limits.',
      },
      {
        q: 'Can we limit scans to a time or location?',
        a: 'Yes. Campaign rules let you restrict scans by venue, region, or timeframe. You can set geographic boundaries, time windows, and access controls for each campaign.',
      },
      {
        q: 'How do we prevent abuse or farming?',
        a: 'Signed links, per-user limits, and real-time anomaly detection protect each campaign. We monitor for suspicious patterns and can automatically block or flag problematic activity.',
      },
      {
        q: 'What if someone gives the item to a friend?',
        a: "Ownership transfers with the item. The new owner becomes the active user, and the scan will no longer connect to the original owner's account. This ensures each item maintains its connection to the current owner.",
      },
      {
        q: 'Can one person register multiple items?',
        a: 'Yes. Limits can be set per user in campaign rules. A single person can register multiple items, which is useful for collectors or members with multiple garments.',
      },
      {
        q: 'What happens if we run out of inventory?',
        a: 'We can redirect scans to a waitlist, alternate reward, or custom message update. This ensures users always receive feedback, even when primary rewards are unavailable.',
      },
    ],
  },
  {
    category: 'Analytics & Integrations',
    items: [
      {
        q: 'Can this connect to our CRM?',
        a: 'Yes. We support most major CRMs and analytics tools that allow API integrations. Data syncs automatically based on your configuration.',
      },
      {
        q: 'What reports are included?',
        a: 'The dashboard includes scans, unique users, repeat engagement, and conversion metrics by item or campaign. You can view time and location insights, plus top-performing campaigns and items.',
      },
    ],
  },
  {
    category: 'Getting Started',
    items: [
      {
        q: 'How do we get started?',
        a: (
          <>
            <p className="mb-4">Start by defining your engagement objectives and measurement priorities. We'll help you design and develop both the clothing and NFC chip integration, then handle tag integration, technical setup, and campaign configuration.</p>
            <Link
              href="/intake"
              className="inline-block px-6 py-3 rounded-2xl font-medium bg-[#F5856E] text-white hover:brightness-110 transition"
            >
              Let&apos;s Connect
            </Link>
          </>
        ),
      },
    ],
  },
];

interface UseCaseCardProps {
  card: {
    h: string;
    p: string;
    img: string;
    subtitle: string;
    bullets: string[];
  };
}

function UseCaseCard({ card }: UseCaseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (isHovered || isFocused)) {
        setIsHovered(false);
        setIsFocused(false);
        cardRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isHovered, isFocused]);

  const showOverlay = isHovered || isFocused;

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={`${card.h} - more info`}
      className="group relative rounded-2xl overflow-hidden border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#33BECC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1422]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <Image
        key={card.img}
        src={card.img}
        alt=""
        width={1600}
        height={900}
        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-200"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
      
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ease-out ${
          showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!showOverlay}
      >
        <div className="absolute inset-0 flex items-center justify-center p-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-5 max-w-md w-full">
            <div className="text-sm font-semibold text-[#33BECC] mb-3 text-center">
              {card.subtitle}
            </div>
            <ul className="space-y-2">
              {card.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2 text-white/90 text-sm">
                  <span className="text-[#33BECC] mt-1.5 flex-shrink-0">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Title strip at bottom */}
      <div className="absolute bottom-0 p-5 left-0 right-0 z-10">
        <div className="text-xl font-medium text-center">{card.h}</div>
        <div className="text-white/80 text-sm text-center">{card.p}</div>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS_BY_CATEGORY.flatMap(cat =>
      cat.items.map((f: any) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": typeof f.a === 'string' ? f.a : 'See page for details' }
      }))
    ),
  };
  return (
    <>
      <SEO pathname="/how-it-works" jsonLd={faqJsonLd} />
      <main className="bg-[#0A1422] text-white">
      {/* SECTION 1 — Hero */}
      <section id="hero" className="relative overflow-hidden min-h-[600px] flex items-center">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/how-it-works-hero.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 py-24 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-5" style={{ color: '#33BECC' }}>
              Make apparel interactive.
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl mx-auto">
              We combine apparel with technology to create lasting connections.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/intake"
                className="px-6 py-3 rounded-2xl font-medium bg-[#F5856E] text-white hover:brightness-110 transition"
              >
                Let&apos;s Connect
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — TLDR Strip */}
      <section id="tldr" className="border-t border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Tag on Apparel', desc: 'Each garment includes a discreet NFC tag.', image: '/images/how-it-works/tag-on-apparel.png' },
              { title: 'Tap to Open', desc: 'A phone tap launches a branded mobile experience.', image: '/images/how-it-works/tap-to-open.png' },
              { title: 'Act and Track', desc: 'Fans or members engage and every interaction is measurable.', image: '/images/how-it-works/act-and-track.png' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10 mb-4 bg-black/30">
                  <Image
                    src={item.image}
                    alt=""
                    width={1200}
                    height={675}
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
                <h3 className="text-xl font-medium mb-1 text-center">{item.title}</h3>
                <p className="text-white/75 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — What Happens on Tap */}
      <section id="flow" className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20">
          <h2 className="text-3xl font-semibold mb-8">What happens on tap</h2>

          <ol className="grid lg:grid-cols-5 gap-5">
            {[
              { h: 'Tag → secure link', p: 'Each tag holds a unique, signed URL.', icon: LinkIcon },
              { h: 'Launch mobile experience', p: 'Your branded page loads instantly.', icon: Smartphone },
              { h: 'Trigger actions', p: 'Join, check in, enter raffle, redeem.', icon: Zap },
              { h: 'Capture engagement data', p: 'Time, location, item, outcome.', icon: BarChart3 },
              { h: 'Close the loop', p: 'Update rewards and sync to CRM.', icon: RefreshCw },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <li
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 flex flex-col h-full"
                >
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center border border-white/10 bg-white/[0.02] mx-auto mb-4 flex-shrink-0">
                    <Icon className="w-8 h-8 text-[#33BECC]" />
                  </div>
                  <div className="text-lg font-medium text-center mb-2 flex-shrink-0 leading-tight">{step.h}</div>
                  <p className="text-white/75 text-sm text-center mt-auto">{step.p}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* SECTION 4 — What Powers It */}
      <section id="components" className="border-t border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20">
          <h2 className="text-3xl font-semibold mb-8">What powers it</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { h: 'Garment + NFC tag', p: 'Durable, wash-safe, unique ID per item.', image: '/images/how-it-works/garment-NFC-tag.png' },
              { h: 'Mobile experience', p: 'Fast loading on your domain.', image: '/images/how-it-works/mobile-experience.png' },
              { h: 'Campaign engine', p: 'Rules for time, place, and rewards.', image: '/images/how-it-works/campaign-engine.png' },
              { h: 'Integrations', p: 'HubSpot, CSV, webhooks, analytics feed.', image: '/images/how-it-works/integrations.png' },
              { h: 'Analytics dashboard', p: 'Scans, uniques, conversion, trends.', image: '/images/how-it-works/analytics-dashboard.png' },
            ].map((card) => (
              <div
                key={card.h}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10 mb-4 bg-black/30">
                  <Image
                    src={card.image}
                    alt=""
                    width={1200}
                    height={675}
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
                <h3 className="text-xl font-medium mb-1 text-center">{card.h}</h3>
                <p className="text-white/75 text-center">{card.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — Real Use Cases */}
      <section id="use-cases" className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20">
          <h2 className="text-3xl font-semibold mb-8">What you can launch now</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                h: 'Geofenced check ins', 
                p: 'Reward verified in person attendance.', 
                img: '/images/how-it-works/geofenced-checkins.png',
                subtitle: 'Verified presence',
                bullets: [
                  'Reward verified in-person attendance without QR codes.',
                  'Tap apparel at locations to unlock access or rewards.',
                  'Measure engagement tied to real-world participation.'
                ]
              },
              { 
                h: 'Time bound drops', 
                p: 'Create urgency with timed rewards.', 
                img: '/images/how-it-works/time-bound-drops.png',
                subtitle: 'The countdown moment',
                bullets: [
                  'Launch rewards that only unlock within a set time window.',
                  'Create excitement and urgency that drives real engagement.',
                  'Exclusive, immediate, and measurable.'
                ]
              },
              { 
                h: 'Raffles and giveaways', 
                p: 'Run fair, trackable digital draws.', 
                img: '/images/how-it-works/raffles-and-giveaways.png',
                subtitle: 'The fair draw',
                bullets: [
                  'Run verifiable, trackable giveaways with each tap logged.',
                  'Randomize rewards transparently - no forms, no bias.',
                  'Announce winners instantly.'
                ]
              },
              { 
                h: 'Redeemable perks', 
                p: 'Unlock offers tied to item ownership.', 
                img: '/images/how-it-works/redeemable-perks.png',
                subtitle: 'Reward in motion',
                bullets: [
                  'Unlock offers, access, or upgrades through what fans wear.',
                  'Redemption works via the garment - no apps or codes.',
                  'Turn each item into an ongoing loyalty touchpoint.'
                ]
              },
            ].map((card) => (
              <UseCaseCard key={card.h} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — Measure What Matters */}
      <section id="metrics" className="border-t border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h2 className="text-3xl font-semibold mb-4">Measure what matters</h2>
            <ul className="space-y-2 text-white/80">
              <li>Scans, unique users, repeat engagement, conversion.</li>
              <li>Location and time insights.</li>
              <li>Top performing campaigns and items.</li>
            </ul>
          </div>
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-white/10 bg-black/30 p-4">
            <Image
              src="/images/how-it-works/measure-what-matters.png"
              alt="Measure what matters"
              width={1200}
              height={700}
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </div>
      </section>

      {/* SECTION 7 — Privacy and Security */}
      <section id="privacy" className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-white/10 bg-black/30">
            <Image
              src="/images/how-it-works/privacy-and-security.png"
              alt=""
              width={1200}
              height={800}
              className="w-full h-full object-cover opacity-90"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h2 className="text-3xl font-semibold mb-4">Privacy and security</h2>
            <ul className="space-y-2 text-white/80">
              <li>Standards based NFC tags (NDEF).</li>
              <li>Signed links to prevent abuse.</li>
              <li>Opt in identity with clear consent.</li>
              <li>Cloud hosting with role based access and audit trails.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 8 — Getting Started */}
      <section id="getting-started" className="border-t border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20">
          <h2 className="text-3xl font-semibold mb-8 text-center">Getting started</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { 
                h: 'Define', 
                p: 'Define your engagement objectives and measurement priorities. Identify what actions you want fans or members to take.' 
              },
              { 
                h: 'Design', 
                p: 'We will design and develop both the clothing and the NFC chip integration.' 
              },
              { 
                h: 'Develop', 
                p: 'Build your collection and campaign. We handle tag integration, technical setup, and campaign configuration.' 
              },
            ].map((card) => (
              <div key={card.h} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h3 className="text-xl font-medium mb-2 text-center">{card.h}</h3>
                <p className="text-white/75 text-center text-sm leading-relaxed">{card.p}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/intake"
              className="inline-block px-8 py-4 rounded-2xl font-semibold text-lg bg-[#F5856E] text-white hover:brightness-110 transition"
            >
              Let&apos;s Connect
            </Link>
            <p className="mt-4 text-sm text-white/60">
              We&apos;ll respond within 24 hours to discuss your goals.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8.5 — Explore Solutions */}
      <section className="border-t border-white/5 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Explore Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/sports-teams" className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10">
              <h3 className="font-medium mb-2">Sports Teams</h3>
              <p className="text-sm text-white/70">Fan engagement that lasts</p>
            </Link>
            <Link href="/schools" className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10">
              <h3 className="font-medium mb-2">Schools & Universities</h3>
              <p className="text-sm text-white/70">Pride that endures</p>
            </Link>
            <Link href="/creators" className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10">
              <h3 className="font-medium mb-2">Creators & Communities</h3>
              <p className="text-sm text-white/70">From viral to enduring</p>
            </Link>
            <Link href="/studios-clubs" className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10">
              <h3 className="font-medium mb-2">Studios & Clubs</h3>
              <p className="text-sm text-white/70">Belonging beyond the property</p>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 9 — FAQs */}
      <section id="faqs" className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20">
          <h2 className="text-3xl font-semibold mb-12">FAQs</h2>

          <div className="space-y-4">
            {FAQS_BY_CATEGORY.map((category, catIndex) => (
              <details key={catIndex} className="group border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
                <summary className="cursor-pointer list-none flex items-center justify-between px-6 py-4 hover:bg-white/[0.04] transition">
                  <h3 className="text-xl font-semibold text-white/90">{category.category}</h3>
                  <span className="text-white/60 text-2xl">+</span>
                </summary>
                <div className="px-6 pb-4 divide-y divide-white/10">
                  {category.items.map((f, i) => (
                    <details key={i} className="py-4 group">
                      <summary className="cursor-pointer list-none flex items-center justify-between">
                        <span className="text-lg font-medium">{f.q}</span>
                        <span className="text-white/60">+</span>
                      </summary>
                      <div className="mt-2 text-white/75">{typeof f.a === 'string' ? <p>{f.a}</p> : f.a}</div>
                    </details>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — Final CTA Banner */}
      <section id="cta-banner" className="relative border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/heroes/how-band.svg"
            alt=""
            width={1600}
            height={900}
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Ready to make connection tangible?
          </h2>
          <Link
            href="/connect"
            className="px-6 py-3 rounded-2xl font-medium bg-[#F5856E] text-white hover:brightness-110 transition"
          >
            Let&apos;s Connect
          </Link>
        </div>
      </section>
    </main>
    </>
  );
}

