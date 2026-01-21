import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Users, Trophy, BarChart3, Zap, Shield } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import Link from "next/link";

export default function EnterprisePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center" style={{
        backgroundImage: 'url(/images/heroes/hero-enterprise.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 py-5xl relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-xl">
              <span style={{ color: '#33BECC', textShadow: '0 2px 8px rgba(255,255,255,0.9)' }}>Enterprise Solutions</span>
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-black" style={{ textShadow: '0 2px 8px rgba(255,255,255,0.9)', marginBottom: '32px' }}>
              Season-scale activations for teams and universities. Create custom apparel and digital rewards.
            </p>
            <Button 
              size="lg" 
              className="bg-accent hover:brightness-110 transition text-navy shadow-lg font-semibold"
              asChild
            >
              <Link href="/intake">Let's Connect</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Section 
        className="py-5xl"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black" style={{ marginBottom: '32px' }}>What You Get</h2>
          <h3 className="text-2xl md:text-3xl font-bold" style={{ color: '#33BECC', marginBottom: '32px' }}>Everything you need to activate your community</h3>
          
          <p className="text-lg text-black leading-relaxed max-w-3xl mx-auto" style={{ marginBottom: '64px' }}>
            From custom apparel to real-time analytics, we provide the full stack for enterprise activations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3xl">
            <Card className="text-center hover:shadow-xl transition-shadow border-2 border-muted" style={{ backgroundColor: '#FFFFFF' }}>
              <CardHeader className="items-center text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-md mx-auto shadow-lg" style={{ backgroundColor: '#33BECC' }}>
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-navy text-2xl font-bold" style={{ textAlign: 'center' }}>Custom Apparel</CardTitle>
                <CardDescription className="text-base font-semibold mt-sm" style={{ textAlign: 'center', color: '#33BECC' }}>
                  At scale, with NFC embedded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-navy" style={{ marginBottom: '48px' }}>
                  Design custom apparel for your team, university, or event. We handle production and embed NFC technology in every piece.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow border-2 border-navy" style={{ backgroundColor: '#303E55' }}>
              <CardHeader className="items-center text-center">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-md mx-auto shadow-lg">
                  <Zap className="w-10 h-10 text-navy" />
                </div>
                <CardTitle className="text-accent text-2xl font-bold" style={{ textAlign: 'center' }}>On-Site Activations</CardTitle>
                <CardDescription className="text-base font-semibold mt-sm" style={{ textAlign: 'center', color: '#33BECC' }}>
                  Turn moments into experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white" style={{ marginBottom: '48px' }}>
                  Tap-to-win games, exclusive content unlocks, and instant rewards. We bring the technology and strategy for unforgettable activations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow border-2 border-muted" style={{ backgroundColor: '#FFFFFF' }}>
              <CardHeader className="items-center text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-md mx-auto shadow-lg" style={{ backgroundColor: '#33BECC' }}>
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-navy text-2xl font-bold" style={{ textAlign: 'center' }}>Data & Insights</CardTitle>
                <CardDescription className="text-base font-semibold mt-sm" style={{ textAlign: 'center', color: '#33BECC' }}>
                  Understand your audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-navy" style={{ marginBottom: '48px' }}>
                  Track engagement, measure ROI, and gain insights into how your community interacts with your brand through privacy-first analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Use Cases Section */}
      <Section 
        className="py-4xl"
        style={{ backgroundColor: '#F7F7F7' }}
        title="Perfect For"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3xl max-w-5xl mx-auto">
          <Card className="hover:shadow-xl transition-shadow border-2 border-muted bg-white text-center">
            <CardHeader className="items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-md mx-auto" style={{ backgroundColor: '#33BECC' }}>
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-navy text-xl font-bold" style={{ textAlign: 'center' }}>Sports Teams & Universities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-navy mb-lg">
                Create exclusive fan experiences, track attendance, reward loyalty, and build deeper connections with your community.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow border-2 border-muted bg-white text-center">
            <CardHeader className="items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-md mx-auto" style={{ backgroundColor: '#303E55' }}>
                <Users className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-navy text-xl font-bold" style={{ textAlign: 'center' }}>Large Scale Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-navy mb-lg">
                Festivals, conferences, and activations. Give attendees wearable access that unlocks VIP experiences and exclusive content.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Contact Form Section */}
      <Section 
        id="talk"
        className="py-5xl"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#303E55' }}>
              <Shield className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black" style={{ marginBottom: '32px' }}>Let's Connect</h2>
          <h3 className="text-2xl md:text-3xl font-bold" style={{ color: '#33BECC', marginBottom: '32px' }}>Schedule a call to explore what Vonga can do for you</h3>
          
          <p className="text-lg text-black leading-relaxed max-w-2xl mx-auto" style={{ marginBottom: '64px' }}>
            We'll discuss your goals, walk through custom pricing and timelines, and explore how we can help activate your community.
          </p>

          <Card className="border-2 border-navy" style={{ backgroundColor: '#303E55' }}>
            <CardContent className="p-3xl">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}
