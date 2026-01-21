'use client';
import Link from 'next/link';
import { GraduationCap, Trophy, Users, LucideIcon } from 'lucide-react';
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

export default function SchoolsPage() {
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vonga.com/" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://www.vonga.com/solutions" },
      { "@type": "ListItem", position: 3, name: "Schools & Universities", item: "https://www.vonga.com/schools" },
    ],
  };
  return (
    <>
      <SEO pathname="/schools" jsonLd={crumbs} />
      <main className="bg-[#0a1422] text-white">
      {/* 1) Hero — Problem + Promise */}
      <section className="relative overflow-hidden pt-24 md:pt-28 px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: 'url(/images/solutions/schools/schools-1.png)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1422]/80 via-[#0a1422]/70 to-[#0a1422]/95"></div>
        <div 
          className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-[#0a1422]/50 to-[#0a1422]"
          style={{ zIndex: 1 }}
        ></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <H1>Your students wear the same colors. Now help them feel part of the same community.</H1>
            <p className="text-white/70 mb-4">
              <Link href="/how-it-works" className="text-[#33BECC] hover:underline">See how it works</Link>
            </p>
            <P className="mt-4">
              Vonga helps universities turn moments of pride into lasting connection, linking students, alumni,
              and fans through everyday experiences that build lifelong belonging.
            </P>
            <CTA href="/intake">Let's Connect</CTA>
          </div>
        </div>
      </section>

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
              src="/images/solutions/schools/schools-2.png"
              alt="Quiet campus after graduation, caps on the ground, feeling of energy gone."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 3) Solution — Make Belonging Tangible */}
      <Section id="solution">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/solutions/schools/schools-3.png"
              alt="Student brushing sleeve of hoodie as soft light responds, a quiet moment of connection."
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
          <div>
            <H2>We make connection something you can wear.</H2>
            <P className="mt-4">
              Vonga blends physical apparel with digital experiences, letting your students and alumni carry their school
              identity into daily life. Each item, a hoodie, a hat, a jersey, becomes a living touchpoint for rewards,
              updates, and shared moments that deepen school spirit. Connection that once faded now travels with them.
            </P>
            <SecondaryCTA href="/how-it-works">See How It Works</SecondaryCTA>
          </div>
        </div>
      </Section>

      {/* 4) Use Cases — Tangible Proof */}
      <Section id="use-cases" className="bg-white/5 rounded-3xl mx-6 md:mx-10 lg:mx-16">
        <H2>Activate student connection. Every day.</H2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <UseCaseCard
            title="Orientation & First-Year Experience"
            looksLike="Connected apparel during welcome week unlocks events, campus challenges, and perks that encourage participation."
            whyItWorks="Builds early belonging and lets student life teams see engagement signals in the first semester."
            icon={GraduationCap}
          />
          <UseCaseCard
            title="Athletics & Spirit Merchandising"
            looksLike="Fans and students wear gear that triggers rewards or exclusive moments at games and across campus."
            whyItWorks="Extends school spirit beyond the stands and turns merch into an ongoing relationship."
            icon={Trophy}
          />
          <UseCaseCard
            title="Alumni & Donor Relations"
            looksLike="Limited-edition items unlock milestone updates, reunion invites, and giving opportunities over time."
            whyItWorks="Keeps alumni emotionally connected and informed long after graduation."
            icon={Users}
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
              src="/images/solutions/schools/schools-4.png"
              alt="Montage of student life, graduation, and alumni reunion connected by soft light trails."
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 6) Close — Invitation */}
      <section id="close" className="relative overflow-hidden px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: 'url(/images/solutions/schools/schools-4.png)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1422]/80 to-[#0e1b2f]/90"></div>
        <div 
          className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#0a1422] via-[#0a1422]/50 to-transparent"
          style={{ zIndex: 1 }}
        ></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <H2>Belonging shouldn't end with a diploma.</H2>
            <P className="mt-4">Let's create experiences your students, alumni, and fans carry for life.</P>
            <CTA href="/intake">Let's Connect</CTA>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}

