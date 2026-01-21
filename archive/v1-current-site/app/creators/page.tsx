'use client';
import Link from 'next/link';
import { Users, Ticket, Award, LucideIcon } from 'lucide-react';
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

export default function CreatorsPage() {
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vonga.com/" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://www.vonga.com/solutions" },
      { "@type": "ListItem", position: 3, name: "Creators & Communities", item: "https://www.vonga.com/creators" },
    ],
  };
  return (
    <>
      <SEO pathname="/creators" jsonLd={crumbs} />
      <main className="bg-[#0a1422] text-white">
      {/* 1) Hero — Problem + Promise */}
      <section className="relative overflow-hidden pt-24 md:pt-28 px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: 'url(/images/solutions/creators/creators-1.png)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1422]/80 via-[#0a1422]/70 to-[#0a1422]/95"></div>
        <div 
          className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-[#0a1422]/50 to-[#0a1422]"
          style={{ zIndex: 1 }}
        ></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <H1>You build moments that go viral. We help them last.</H1>
            <p className="text-white/70 mb-4">
              <Link href="/how-it-works" className="text-[#33BECC] hover:underline">See how it works</Link>
            </p>
            <P className="mt-4">
              Vonga helps creators and communities turn short bursts of excitement into long-term connection,
              making belonging something your people can see, feel, and carry every day.
            </P>
            <CTA href="/intake">Let's Connect</CTA>
          </div>
        </div>
      </section>

      {/* 2) Challenge — Engagement Cliff */}
      <Section id="challenge" className="bg-white/5 rounded-3xl mx-6 md:mx-10 lg:mx-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H2>Online, everything moves fast. Maybe too fast.</H2>
            <P className="mt-4">
              You launch, you post, you drop, and it hits. Then, almost instantly, it's gone. Algorithms move on. Feeds reset. The moment fades.
            </P>
            <P className="mt-4">
              What if the energy didn't have to end? What if the people who showed up once, stayed connected, for real?
            </P>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/solutions/creators/creators-2.png"
              alt="Empty livestream set or studio after a session, moody cinematic lighting."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 3) Opportunity — Followers vs Belonging */}
      <Section id="opportunity">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/solutions/creators/creators-3.png"
              alt="Fans in a real-world setting connected by faint light ribbons, moody cinematic tone."
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
          <div>
            <H2>Your audience doesn't want more content. They want connection.</H2>
            <P className="mt-4">
              Followers come and go. Communities stay when they feel seen. Vonga turns your audience into members,
              people who carry your story in what they wear, share, and do.
            </P>
            <P className="mt-4">
              Each piece becomes a thread that connects them back to you and to each other. It's not merch. It's meaning.
            </P>
            <SecondaryCTA href="/how-it-works">See How It Works</SecondaryCTA>
          </div>
        </div>
      </Section>

      {/* 4) Use Cases — Tangible Proof */}
      <Section id="use-cases" className="bg-white/5 rounded-3xl mx-6 md:mx-10 lg:mx-16">
        <H2>Activate community connection. Every day.</H2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <UseCaseCard
            title="Community Memberships"
            looksLike="Members receive connected apparel that unlocks access to private content, IRL meetups, and drops."
            whyItWorks="Builds a real sense of belonging and identity beyond the platform."
            icon={Users}
          />
          <UseCaseCard
            title="Event & Tour Merch"
            looksLike="Fans activate apparel at live events to unlock digital keepsakes or exclusive moments."
            whyItWorks="Extends the emotional high of an event long after it's over."
            icon={Ticket}
          />
          <UseCaseCard
            title="Creator Loyalty Programs"
            looksLike="Supporters earn recognition and perks by engaging with your world over time."
            whyItWorks="Turns passive fans into active advocates while staying human."
            icon={Award}
          />
        </div>
      </Section>

      {/* 5) Proof — Emotion Made Visible */}
      <Section id="proof">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H2>Engagement that doesn't fade. Data that doesn't lie.</H2>
            <P className="mt-4">
              When connection lasts, everything changes. Fans stay loyal. Communities grow naturally.
              And the engagement you once hoped for becomes something you can actually see.
            </P>
            <P className="mt-4">
              Vonga helps creators and community builders measure emotion without losing authenticity.
            </P>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/solutions/creators/creators-4.png"
              alt="Close-up montage: connected apparel glow, human expressions, subtle data overlays."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 6) Close — Invitation */}
      <section id="close" className="relative overflow-hidden px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: 'url(/images/solutions/creators/creators-5.png)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1422]/80 to-[#0e1b2f]/90"></div>
        <div 
          className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#0a1422] via-[#0a1422]/50 to-transparent"
          style={{ zIndex: 1 }}
        ></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <H2>Build a community that endures.</H2>
            <P className="mt-4">
              You've built something people care about. Now give them a way to carry it with them, every day.
            </P>
            <CTA href="/intake">Let's Connect</CTA>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
