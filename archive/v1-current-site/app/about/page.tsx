import { Section } from "@/components/Section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, Eye, BookOpen, Lock, Users, Award } from "lucide-react";
import SEO from "@/components/SEO";

export default function AboutPage() {
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vonga.com/" },
      { "@type": "ListItem", position: 2, name: "About", item: "https://www.vonga.com/about" },
    ],
  };
  return (
    <>
      <SEO pathname="/about" jsonLd={crumbs} />
      <div className="bg-[#0a1422] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 md:pt-28 px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: 'url(/images/heroes/about-hero.svg)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1422]/80 via-[#0a1422]/70 to-[#0a1422]/95"></div>
        <div 
          className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-[#0a1422]/50 to-[#0a1422]"
          style={{ zIndex: 1 }}
        ></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4 text-white">
              About Vonga
            </h1>
            <p className="text-2xl md:text-3xl font-bold mb-2xl" style={{ color: '#33BECC' }}>
              On-body tech that brings people together
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <Section 
        className="py-16 md:py-24"
        style={{ backgroundColor: '#0a1422' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <Target className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '32px' }}>Mission</h2>
          <h3 className="text-2xl md:text-3xl font-bold" style={{ color: '#33BECC', marginBottom: '32px' }}>Why We Exist</h3>
          
          <div>
            <p className="text-xl md:text-2xl font-bold text-white leading-relaxed" style={{ marginBottom: '32px' }}>
              To make everyday apparel a gateway to connection, experiences, and rewards.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              We believe what you wear should bring you closer to the communities and brands you love, not just cover your back.
            </p>
          </div>
        </div>
      </Section>

      {/* Vision Section */}
      <Section 
        className="py-16 md:py-24 bg-white/5 rounded-3xl mx-6 md:mx-10 lg:mx-16"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#303E55' }}>
              <Eye className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '32px' }}>Vision</h2>
          <h3 className="text-2xl md:text-3xl font-bold" style={{ color: '#33BECC', marginBottom: '32px' }}>The Future We're Building</h3>
          
          <div>
            <p className="text-xl md:text-2xl font-bold text-white leading-relaxed" style={{ marginBottom: '32px' }}>
              A world where connection is effortless.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              Your clothes unlock entry to events, reward you for showing up, and recognize your loyalty with a single tap. No apps. No friction. Just connection.
            </p>
          </div>
        </div>
      </Section>

      {/* Story Section */}
      <Section 
        className="py-16 md:py-24"
        style={{ backgroundColor: '#0a1422' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '32px' }}>Our Story</h2>
          <h3 className="text-2xl md:text-3xl font-bold" style={{ color: '#33BECC', marginBottom: '32px' }}>From Idea to Movement</h3>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-base text-white/80 leading-relaxed" style={{ marginBottom: '32px' }}>
              We started Vonga with a simple belief: loyalty should feel exciting, not like homework. Traditional punch cards and apps were disconnected from real life.
            </p>
            
            <p className="text-base text-white/80 leading-relaxed" style={{ marginBottom: '32px' }}>
              We asked: <span className="font-semibold text-white">What if the clothes you already wear could be the key?</span>
            </p>
            
            <p className="text-base text-white/80 leading-relaxed" style={{ marginBottom: '32px' }}>
              That question turned into a platform that embeds technology into apparel, making it possible to unlock experiences, rewards, and status with a single tap.
            </p>
            
            <p className="text-base text-white/80 leading-relaxed" style={{ marginBottom: '32px' }}>
              Today, Vonga powers engagement for gyms, communities, and event organizers. Every garment becomes a touchpoint that connects people in the real world.
            </p>
            
            <p className="text-lg font-bold text-white leading-relaxed">
              And we're just getting started.
            </p>
          </div>
        </div>
      </Section>

      {/* Values Section */}
      <Section 
        className="py-16 md:py-24 bg-white/5 rounded-3xl mx-6 md:mx-10 lg:mx-16"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '64px' }}>What Drives Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3xl">
            <Card className="text-center hover:shadow-xl transition-shadow border-2 border-white/10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <CardHeader className="items-center text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-md mx-auto shadow-lg" style={{ backgroundColor: '#33BECC' }}>
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-white text-2xl font-bold" style={{ textAlign: 'center', marginBottom: '16px' }}>Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-white/80" style={{ marginBottom: '32px' }}>
                  Your data belongs to you. We only collect what's needed, and you control everything.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow border-2 border-white/10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <CardHeader className="items-center text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-md mx-auto shadow-lg" style={{ backgroundColor: '#33BECC' }}>
                  <Users className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-white text-2xl font-bold" style={{ textAlign: 'center', marginBottom: '16px' }}>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-white/80" style={{ marginBottom: '32px' }}>
                  We build for the people who show up, the communities who stay connected, and the moments that matter.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow border-2 border-white/10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <CardHeader className="items-center text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-md mx-auto shadow-lg" style={{ backgroundColor: '#33BECC' }}>
                  <Award className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-white text-2xl font-bold" style={{ textAlign: 'center', marginBottom: '16px' }}>Quality Obsessed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-white/80" style={{ marginBottom: '32px' }}>
                  From fabric to technology, we sweat the details. Every product is built to last and perform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </div>
    </>
  );
}
