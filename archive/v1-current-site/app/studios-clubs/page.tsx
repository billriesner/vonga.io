'use client';
import Link from 'next/link';
import { Dumbbell, Trophy, Users, LucideIcon } from 'lucide-react';
import SEO from '@/components/SEO';
import type { ReactNode } from 'react';

function Section({ id, children, className = '' }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`px-6 md:px-10 lg:px-16 py-16 md:py-24 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

function H1({ children }: { children: ReactNode }) {
  return <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">{children}</h1>;
}

function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{children}</h2>;
}

function P({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-base md:text-lg text-white/80 leading-relaxed ${className}`}>{children}</p>;
}

function CTA({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-2xl px-5 py-3 mt-6 font-medium bg-[#F5856E] text-white hover:brightness-110 transition"
    >
      {children}
    </Link>
  );
}

function SecondaryCTA({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-2xl px-5 py-3 mt-6 font-medium bg-[#33BECC] text-white hover:brightness-110 transition"
    >
      {children}
    </Link>
  );
}

function UseCaseCard({ title, looksLike, whyItWorks, icon: Icon }: { title: string; looksLike: string; whyItWorks: string; icon: LucideIcon }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="flex items-center justify-center p-8 bg-black/30">
        <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#33BECC' }}>
          <Icon className="w-10 h-10 text-white" />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="space-y-4 text-white/80">
          <div>
            <div className="text-white/60 text-sm font-medium mb-2">What it looks like</div>
            <p className="leading-relaxed text-sm">{looksLike}</p>
          </div>
          <div>
            <div className="text-white/60 text-sm font-medium mb-2">Why it works</div>
            <p className="leading-relaxed text-sm">{whyItWorks}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudiosClubsPage() {
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vonga.com/" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://www.vonga.com/solutions" },
      { "@type": "ListItem", position: 3, name: "Studios & Clubs", item: "https://www.vonga.com/studios-clubs" },
    ],
  };
  return (
    <>
      <SEO pathname="/studios-clubs" jsonLd={crumbs} />
      <main className="bg-[#0a1422] text-white">
      {/* 1) Hero — Problem + Promise */}
      <section className="relative overflow-hidden pt-24 md:pt-28 px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: 'url(/images/solutions/studios-clubs/studios-1.png)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1422]/80 via-[#0a1422]/70 to-[#0a1422]/95"></div>
        <div 
          className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-[#0a1422]/50 to-[#0a1422]"
          style={{ zIndex: 1 }}
        ></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <H1>Connection Beyond the Club</H1>
            <p className="text-white/70 mb-4">
              <Link href="/how-it-works" className="text-[#33BECC] hover:underline">See how it works</Link>
            </p>
            <P className="mt-4">
              Membership isn't just access. It's identity that endures. Vonga connects every class, every round, and every interaction into one living sense of belonging.
            </P>
            <CTA href="/intake">Let's Connect</CTA>
          </div>
        </div>
      </section>

      {/* 2) Challenge */}
      <Section id="challenge" className="bg-white/5 rounded-3xl mx-6 md:mx-10 lg:mx-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H2>Studios and clubs thrive on community. Yet most loyalty efforts stop at the front desk.</H2>
            <P className="mt-4">
              Members join for experience, but connection fades once they leave the property. What if belonging didn't end when they walked out the door?
            </P>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/solutions/studios-clubs/studios-2.png"
              alt="Empty fitness studio or club after hours"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 3) Solution */}
      <Section id="solution">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/solutions/studios-clubs/studios-3.png"
              alt="Member interacting with connected apparel"
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
          <div>
            <H2>The Connected Club</H2>
            <P className="mt-4">
              Vonga transforms apparel and access into continuity. With embedded on-body tech, each piece becomes a living symbol of membership, bridging physical and digital loyalty.
            </P>
            <SecondaryCTA href="/how-it-works">See How It Works</SecondaryCTA>
          </div>
        </div>
      </Section>

      {/* 4) Use Cases */}
      <Section id="use-cases" className="bg-white/5 rounded-3xl mx-6 md:mx-10 lg:mx-16">
        <H2>Activate member connection. Every day.</H2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <UseCaseCard
            title="Fitness Studios"
            looksLike="Members wear connected apparel that tracks achievements and unlocks exclusive content or rewards."
            whyItWorks="Creates ongoing engagement between classes and builds community beyond the studio walls."
            icon={Dumbbell}
          />
          <UseCaseCard
            title="Golf & Country Clubs"
            looksLike="Members activate apparel on the course to access exclusive events, dining perks, and social connections."
            whyItWorks="Extends the club experience beyond the property and strengthens member relationships."
            icon={Trophy}
          />
          <UseCaseCard
            title="Social & Wellness Clubs"
            looksLike="Event attendees receive connected items that unlock follow-up content, community challenges, and future event access."
            whyItWorks="Transforms one-time events into ongoing relationships and community building opportunities."
            icon={Users}
          />
        </div>
      </Section>

      {/* 5) Impact */}
      <Section id="impact">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H2>Belonging that lasts beyond the membership.</H2>
            <P className="mt-4">
              When connection extends beyond the property, everything changes. Members become advocates. Retention improves naturally. Your club becomes part of their daily identity.
            </P>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/solutions/studios-clubs/studios-4.png"
              alt="Members connected through various club activities and experiences"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 6) Close */}
      <section id="close" className="relative overflow-hidden px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: 'url(/images/solutions/studios-clubs/studios-4.png)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1422]/80 to-[#0e1b2f]/90"></div>
        <div 
          className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#0a1422] via-[#0a1422]/50 to-transparent"
          style={{ zIndex: 1 }}
        ></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <H2>Ready to create belonging that lasts?</H2>
            <P className="mt-4">
              Your members already love what you offer. Now give them a way to carry that connection with them, every day.
            </P>
            <CTA href="/intake">Let's Connect</CTA>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
