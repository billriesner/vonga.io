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

export default function StudiosClubsPage() {
  return (
    <main className="bg-[#0a1422] text-white">
      {/* 1) Hero — Problem + Promise */}
      <Section className="pt-24 md:pt-28">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H1>Connection Beyond the Club</H1>
            <P className="mt-4">
              Membership isn't just access. It's identity that endures. Vonga connects every class, every round, and every interaction into one living sense of belonging.
            </P>
            <CTA href="/intake">Let's Connect</CTA>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/studiosclubs-connected.jpg"
              alt="Members connected through motion and apparel"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

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
              src="/images/studiosclubs-challenge.jpg"
              alt="Empty fitness studio or club after hours"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 3) Solution */}
      <Section id="solution">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <H2>The Connected Club</H2>
            <P className="mt-4">
              Vonga transforms apparel and access into continuity. With embedded on-body tech, each piece becomes a living symbol of membership, bridging physical and digital loyalty.
            </P>
            <SecondaryCTA href="/how-it-works">See How It Works</SecondaryCTA>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/studiosclubs-solution.jpg"
              alt="Member interacting with connected apparel"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 4) Use Cases */}
      <Section id="use-cases" className="bg-white/5 rounded-3xl mx-6 md:mx-10 lg:mx-16">
        <H2>How studios and clubs are using Vonga</H2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <UseCaseCard
            title="Fitness Studios"
            looksLike="Members wear connected apparel that tracks achievements and unlocks exclusive content or rewards."
            whyItWorks="Creates ongoing engagement between classes and builds community beyond the studio walls."
            imgSrc="/images/studiosclubs-gym.jpg"
            imgAlt="Gym member experience with connected apparel"
          />
          <UseCaseCard
            title="Golf & Country Clubs"
            looksLike="Members activate apparel on the course to access exclusive events, dining perks, and social connections."
            whyItWorks="Extends the club experience beyond the property and strengthens member relationships."
            imgSrc="/images/studiosclubs-golf.jpg"
            imgAlt="Golf club experience with member interactions"
          />
          <UseCaseCard
            title="Social & Wellness Clubs"
            looksLike="Event attendees receive connected items that unlock follow-up content, community challenges, and future event access."
            whyItWorks="Transforms one-time events into ongoing relationships and community building opportunities."
            imgSrc="/images/studiosclubs-community.jpg"
            imgAlt="Community engagement and social events"
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
              src="/images/studiosclubs-impact.jpg"
              alt="Members connected through various club activities and experiences"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 6) Close */}
      <Section id="close" className="bg-gradient-to-b from-[#0a1422] to-[#0e1b2f]">
        <div className="text-center max-w-3xl mx-auto">
          <H2>Ready to create belonging that lasts?</H2>
          <P className="mt-4">
            Your members already love what you offer. Now give them a way to carry that connection with them, every day.
          </P>
          <CTA href="/intake">Let's Connect</CTA>
        </div>
      </Section>
    </main>
  );
}
