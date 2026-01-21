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

export default function SportsTeamsPage() {
  return (
    <main className="bg-[#0a1422] text-white">
      {/* 1) Hero — Problem + Promise */}
      <Section className="pt-24 md:pt-28">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H1>Your fans' passion shouldn't fade after game day.</H1>
            <P className="mt-4">
              Vonga helps teams turn emotion into connection that lasts, building loyalty, sponsorship value,
              and year-round engagement through everyday experiences.
            </P>
            <CTA href="/intake">Let's Connect</CTA>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/heroes/sports-hero.jpg"
              alt="Stadium crowd mid-celebration with subtle light ribbons connecting fans."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 2) Challenge */}
      <Section id="challenge" className="bg-white/5 rounded-3xl mx-6 md:mx-10 lg:mx-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H2>Game-day energy is unmatched. But it disappears overnight.</H2>
            <P className="mt-4">
              Every chant, jersey, and shared moment builds emotion, and then it's gone. Merch sells, but it doesn't connect.
              Fans engage online, but the spark fades by Monday. You're surrounded by data, yet the human part of fandom slips through.
            </P>
            <P className="mt-4">
              Vonga closes that gap by turning what fans wear into a living link between your team and their daily lives.
            </P>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/sports-challenge.jpg"
              alt="Empty stands glowing faintly after a game."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 3) Solution */}
      <Section id="solution">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H2>We make connection part of the experience.</H2>
            <P className="mt-4">
              Our platform blends physical and digital touchpoints to extend fandom beyond the arena. Each item,
              activation, or reward becomes a simple, trackable moment of belonging, something fans feel, partners
              can measure, and teams can grow.
            </P>
            <SecondaryCTA href="/how-it-works">See How It Works</SecondaryCTA>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/sports-solution.jpg"
              alt="Fan interacting with team gear and receiving a digital reward."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 4) Use Cases */}
      <Section id="use-cases" className="bg-white/5 rounded-3xl mx-6 md:mx-10 lg:mx-16">
        <H2>How teams are using Vonga today</H2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <UseCaseCard
            title="Fan Loyalty Loop"
            looksLike="Fans scan gear to unlock exclusive content, early drops, and tickets."
            whyItWorks="Keeps fans engaged all season with simple touchpoints they already enjoy."
            imgSrc="/images/usecase-loyalty.jpg"
            imgAlt="Fan scanning jersey and unlocking content."
          />
          <UseCaseCard
            title="Sponsor Activations"
            looksLike="Partners tie rewards directly to what fans wear at games."
            whyItWorks="Turns impressions into measurable ROI with clear engagement data."
            imgSrc="/images/usecase-sponsor.jpg"
            imgAlt="Sponsor moment triggered by apparel interaction."
          />
          <UseCaseCard
            title="Community Connection"
            looksLike="Local clubs use scans to trigger donations and team events."
            whyItWorks="Builds belonging beyond the scoreboard while creating reasons to reconnect."
            imgSrc="/images/usecase-community.jpg"
            imgAlt="Community event tied to team gear."
          />
        </div>
      </Section>

      {/* 5) Impact */}
      <Section id="impact">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H2>Connection you can see. Loyalty you can measure.</H2>
            <P className="mt-4">
              When emotion lasts, everything changes. Fans become community. Merch becomes relationship.
              Sponsorship becomes partnership. With Vonga, every moment builds toward something bigger, a season
              that never really ends.
            </P>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/sports-impact.jpg"
              alt="Fan scenes blended with subtle engagement metrics overlay."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 6) Close */}
      <Section id="close" className="bg-gradient-to-b from-[#0a1422] to-[#0e1b2f]">
        <div className="text-center max-w-3xl mx-auto">
          <H2>Make belonging your competitive edge.</H2>
          <P className="mt-4">
            The next great fan experience won't be louder. It'll be closer. Let's create something your fans can feel every day.
          </P>
          <CTA href="/intake">Let's Connect</CTA>
        </div>
      </Section>
    </main>
  );
}