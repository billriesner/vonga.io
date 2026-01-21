'use client';
import Link from 'next/link';
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

function UseCaseCard({ title, looksLike, whyItWorks, imgSrc, imgAlt }: { title: string; looksLike: string; whyItWorks: string; imgSrc: string; imgAlt: string }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="aspect-[16/9] bg-black/30">
        <img src={imgSrc} alt={imgAlt} className="w-full h-full object-cover opacity-90" />
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
  return (
    <main className="bg-[#0a1422] text-white">
      {/* 1) Hero — Problem + Promise */}
      <Section className="pt-24 md:pt-28">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H1>You build moments that go viral. We help them last.</H1>
            <P className="mt-4">
              Vonga helps creators and communities turn short bursts of excitement into long-term connection,
              making belonging something your people can see, feel, and carry every day.
            </P>
            <CTA href="/intake">Let's Connect</CTA>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/heroes/creators-hero.jpg"
              alt="Creator on stage or in studio, followers subtly connected by soft aqua light trails."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

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
              src="/images/creators-challenge.jpg"
              alt="Empty livestream set or studio after a session, moody cinematic lighting."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 3) Opportunity — Followers vs Belonging */}
      <Section id="opportunity">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
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
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/creators-opportunity.jpg"
              alt="Fans in a real-world setting connected by faint light ribbons, moody cinematic tone."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 4) Use Cases — Tangible Proof */}
      <Section id="use-cases" className="bg-white/5 rounded-3xl mx-6 md:mx-10 lg:mx-16">
        <H2>How creators and communities are using Vonga</H2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <UseCaseCard
            title="Community Memberships"
            looksLike="Members receive connected apparel that unlocks access to private content, IRL meetups, and drops."
            whyItWorks="Builds a real sense of belonging and identity beyond the platform."
            imgSrc="/images/usecase-memberships.jpg"
            imgAlt="Community gathering with subtle connection cues."
          />
          <UseCaseCard
            title="Event & Tour Merch"
            looksLike="Fans activate apparel at live events to unlock digital keepsakes or exclusive moments."
            whyItWorks="Extends the emotional high of an event long after it's over."
            imgSrc="/images/usecase-events.jpg"
            imgAlt="Live event moment with apparel activation."
          />
          <UseCaseCard
            title="Creator Loyalty Programs"
            looksLike="Supporters earn recognition and perks by engaging with your world over time."
            whyItWorks="Turns passive fans into active advocates while staying human."
            imgSrc="/images/usecase-loyalty-creators.jpg"
            imgAlt="Supporters recognized for ongoing engagement."
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
              src="/images/creators-proof.jpg"
              alt="Close-up montage: connected apparel glow, human expressions, subtle data overlays."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 6) Close — Invitation */}
      <Section id="close" className="bg-gradient-to-b from-[#0a1422] to-[#0e1b2f]">
        <div className="text-center max-w-3xl mx-auto">
          <H2>Build a community that endures.</H2>
          <P className="mt-4">
            You've built something people care about. Now give them a way to carry it with them, every day.
          </P>
          <CTA href="/intake">Let's Connect</CTA>
        </div>
      </Section>
    </main>
  );
}
