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

export default function SchoolsPage() {
  return (
    <main className="bg-[#0a1422] text-white">
      {/* 1) Hero — Problem + Promise */}
      <Section className="pt-24 md:pt-28">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H1>Your students wear the same colors. Now help them feel part of the same community.</H1>
            <P className="mt-4">
              Vonga helps universities turn moments of pride into lasting connection, linking students, alumni,
              and fans through everyday experiences that build lifelong belonging.
            </P>
            <CTA href="/intake">Let's Connect</CTA>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/heroes/schools-hero.jpg"
              alt="Diverse students on the quad in school colors, subtly connected by light ribbons."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 2) Challenge — Fragmented Belonging */}
      <Section id="challenge" className="bg-white/5 rounded-3xl mx-6 md:mx-10 lg:mx-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H2>School pride is powerful. But it's also fleeting.</H2>
            <P className="mt-4">
              From move-in to graduation, each moment of connection fades as fast as it appears. Merchandise becomes a logo,
              not a memory. Alumni outreach becomes another email. What's missing is continuity, the emotional thread that keeps
              people feeling part of something bigger.
            </P>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/schools-challenge.jpg"
              alt="Quiet campus after graduation, caps on the ground, feeling of energy gone."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 3) Solution — Make Belonging Tangible */}
      <Section id="solution">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H2>We make connection something you can wear.</H2>
            <P className="mt-4">
              Vonga blends physical apparel with digital experiences, letting your students and alumni carry their school
              identity into daily life. Each item, a hoodie, a hat, a jersey, becomes a living touchpoint for rewards,
              updates, and shared moments that deepen school spirit. Connection that once faded now travels with them.
            </P>
            <SecondaryCTA href="/how-it-works">See How It Works</SecondaryCTA>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/schools-solution.jpg"
              alt="Student brushing sleeve of hoodie as soft light responds, a quiet moment of connection."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 4) Use Cases — Tangible Proof */}
      <Section id="use-cases" className="bg-white/5 rounded-3xl mx-6 md:mx-10 lg:mx-16">
        <H2>How schools are using Vonga</H2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <UseCaseCard
            title="Orientation & First-Year Experience"
            looksLike="Connected apparel during welcome week unlocks events, campus challenges, and perks that encourage participation."
            whyItWorks="Builds early belonging and lets student life teams see engagement signals in the first semester."
            imgSrc="/images/usecase-orientation.jpg"
            imgAlt="First-year students at orientation engaging with connected apparel."
          />
          <UseCaseCard
            title="Athletics & Spirit Merchandising"
            looksLike="Fans and students wear gear that triggers rewards or exclusive moments at games and across campus."
            whyItWorks="Extends school spirit beyond the stands and turns merch into an ongoing relationship."
            imgSrc="/images/usecase-spirit.jpg"
            imgAlt="Game-day spirit moment with connected gear."
          />
          <UseCaseCard
            title="Alumni & Donor Relations"
            looksLike="Limited-edition items unlock milestone updates, reunion invites, and giving opportunities over time."
            whyItWorks="Keeps alumni emotionally connected and informed long after graduation."
            imgSrc="/images/usecase-alumni.jpg"
            imgAlt="Alumni reunion moment with subtle connection cues."
          />
        </div>
      </Section>

      {/* 5) Results — Continuity Payoff */}
      <Section id="results">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H2>From moment to memory, and back again.</H2>
            <P className="mt-4">
              When connection lasts, pride grows stronger. Students become advocates. Alumni become lifelong ambassadors.
              Your school's story doesn't end at graduation, it evolves with every touchpoint.
            </P>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/schools-results.jpg"
              alt="Montage of student life, graduation, and alumni reunion connected by soft light trails."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 6) Close — Invitation */}
      <Section id="close" className="bg-gradient-to-b from-[#0a1422] to-[#0e1b2f]">
        <div className="text-center max-w-3xl mx-auto">
          <H2>Belonging shouldn't end with a diploma.</H2>
          <P className="mt-4">Let's create experiences your students, alumni, and fans carry for life.</P>
          <CTA href="/intake">Let's Connect</CTA>
        </div>
      </Section>
    </main>
  );
}

