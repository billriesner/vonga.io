import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Gift, Sparkles, Shirt, Target, Zap, CheckCircle2, BarChart3, Heart, Clock, Bell, Trophy, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ClubPage() {
  return (
    <div>
      {/* Hero Section with Image */}
      <section className="relative overflow-hidden min-h-[600px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/heroes/hero-placeholder.jpg)' }}
        ></div>
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="max-w-7xl mx-auto px-4 py-5xl md:py-[120px] relative z-10 w-full">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-2xl">
              <span className="text-navy">Club Vonga</span>
            </h1>
            <p className="text-2xl md:text-3xl font-bold mb-xl" style={{ color: '#33BECC', textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
              On-body tech for gyms, golf courses, and communities
            </p>
            <p className="text-lg md:text-xl font-semibold mb-3xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#000000', textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
              We help you launch rewards and member perks with ease. Turn your community's apparel into access, recognition, and moments that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-md justify-center items-center">
              <Button 
                size="lg" 
                className="min-w-[160px] text-white shadow-lg font-semibold"
                style={{ backgroundColor: '#33BECC' }}
                asChild
              >
                <Link href="/club/get-started">Get Started</Link>
              </Button>
              <Button 
                size="lg" 
                className="min-w-[160px] border-2 border-navy bg-white text-navy hover:bg-navy hover:text-white shadow-lg font-semibold"
                asChild
              >
                <Link href="/enterprise#talk">Book a Call</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Club Vonga - 2 Column Layout */}
      <Section 
        className="py-5xl"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '48px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <Sparkles className="w-10 h-10 text-navy" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy text-center" style={{ marginBottom: '24px' }}>Why Club Vonga?</h2>
          <h3 className="text-2xl md:text-3xl font-bold text-center" style={{ color: '#33BECC', marginBottom: '64px' }}>What your members get</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4xl max-w-5xl mx-auto">
            <div className="text-center" style={{ marginBottom: '32px' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#33BECC', marginBottom: '24px' }}>
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-navy" style={{ marginBottom: '12px' }}>Tap to Check In</h3>
              <p className="text-base font-semibold" style={{ color: '#33BECC', marginBottom: '16px' }}>
                Seamless rewards tracking
              </p>
              <p className="text-sm text-text/70 leading-relaxed">
                Members tap their apparel to check in. No apps, no fumbling with phones. Just tap and go.
              </p>
            </div>

            <div className="text-center" style={{ marginBottom: '32px' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#33BECC', marginBottom: '24px' }}>
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-navy" style={{ marginBottom: '12px' }}>Earn Rewards</h3>
              <p className="text-base font-semibold" style={{ color: '#33BECC', marginBottom: '16px' }}>
                Real perks, not just points
              </p>
              <p className="text-sm text-text/70 leading-relaxed">
                Unlock discounts, free classes, exclusive events, and more. You set the rewards that make sense for your community.
              </p>
            </div>

            <div className="text-center" style={{ marginBottom: '32px' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#303E55', marginBottom: '24px' }}>
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-navy" style={{ marginBottom: '12px' }}>Feel Recognized</h3>
              <p className="text-base font-semibold" style={{ color: '#33BECC', marginBottom: '16px' }}>
                Build stronger connections
              </p>
              <p className="text-sm text-text/70 leading-relaxed">
                Every tap shows your members they're seen and valued. Simple interactions that build lasting community loyalty.
              </p>
            </div>

            <div className="text-center" style={{ marginBottom: '32px' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#303E55', marginBottom: '24px' }}>
                <Heart className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-navy" style={{ marginBottom: '12px' }}>No Forgotten Cards</h3>
              <p className="text-base font-semibold" style={{ color: '#33BECC', marginBottom: '16px' }}>
                Always wearing your membership
              </p>
              <p className="text-sm text-text/70 leading-relaxed">
                Members never forget their rewards card again. Their connected apparel is always with them.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Members Using Tech Image */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="w-full">
          <img src="/images/icons/tap-in.svg" alt="Members checking in with Vonga tap technology" className="w-full h-auto" />
        </div>
      </section>

      {/* What's Possible - Full Width Content Block */}
      <Section 
        className="py-5xl"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '48px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#303E55' }}>
              <Zap className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy text-center" style={{ marginBottom: '24px' }}>What's Possible with Vonga Tech</h2>
          <h3 className="text-2xl md:text-3xl font-bold text-center" style={{ color: '#33BECC', marginBottom: '48px' }}>Go beyond basic check-ins</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3xl">
            <Card className="text-center hover:shadow-xl transition-shadow border-2 border-muted" style={{ backgroundColor: '#FFFFFF' }}>
              <CardHeader className="items-center text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-md mx-auto shadow-lg" style={{ backgroundColor: '#33BECC' }}>
                  <Bell className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-navy text-2xl font-bold" style={{ textAlign: 'center' }}>Push Custom Content</CardTitle>
                <CardDescription className="text-base font-semibold mt-sm" style={{ textAlign: 'center', color: '#33BECC' }}>
                  Deliver targeted media on demand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-navy" style={{ marginBottom: '48px' }}>
                  Load images or videos for people to watch when they tap their clothes. Notify them through a simple push notification.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow border-2 border-navy" style={{ backgroundColor: '#303E55' }}>
              <CardHeader className="items-center text-center">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-md mx-auto shadow-lg">
                  <Trophy className="w-10 h-10 text-navy" />
                </div>
                <CardTitle className="text-accent text-2xl font-bold" style={{ textAlign: 'center' }}>Raffles & Prizes</CardTitle>
                <CardDescription className="text-base font-semibold mt-sm" style={{ textAlign: 'center', color: '#33BECC' }}>
                  Gamify engagement with instant wins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white" style={{ marginBottom: '48px' }}>
                  Win prizes randomly when tapping. You set the prizes and how frequently you want people to win. Include common prizes and more rare "chase" items.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow border-2 border-muted" style={{ backgroundColor: '#FFFFFF' }}>
              <CardHeader className="items-center text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-md mx-auto shadow-lg" style={{ backgroundColor: '#33BECC' }}>
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-navy text-2xl font-bold" style={{ textAlign: 'center' }}>Geotargeted Experiences</CardTitle>
                <CardDescription className="text-base font-semibold mt-sm" style={{ textAlign: 'center', color: '#33BECC' }}>
                  Location-based activation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-navy" style={{ marginBottom: '48px' }}>
                  Transform any location (down to ~50 ft radius) into a scavenger hunt location or check point. Simply tap the garment when at the location to earn points, collect badges, watch targeted content, and more.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* How It Works - Horizontal Steps */}
      <Section 
        className="py-5xl"
        style={{ backgroundColor: '#F7F7F7' }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-navy text-center" style={{ marginBottom: '24px' }}>How It Works</h2>
          <h3 className="text-2xl md:text-3xl font-bold text-center" style={{ color: '#33BECC', marginBottom: '48px' }}>Three simple steps to connected community</h3>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-1 bg-accent/30" style={{ zIndex: 0 }}></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl relative" style={{ zIndex: 1 }}>
              <div className="text-center flex flex-col">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#33BECC', marginBottom: '32px' }}>
                  <Shirt className="w-10 h-10 text-white" />
                </div>
                <div className="bg-white rounded-lg p-lg border-2 border-muted flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-navy" style={{ marginBottom: '16px' }}>1. Get Your Gear</h3>
                  <p className="text-sm font-semibold" style={{ color: '#33BECC', marginBottom: '24px' }}>
                    Custom branded apparel with NFC
                  </p>
                  <p className="text-sm text-text/70 leading-relaxed">
                    Choose from our starter kits. 10% deposit secures your order.
                    <br /><br />
                    We design and produce branded apparel with invisible NFC technology embedded inside. 48-hour order confirmation turnaround.
                  </p>
                </div>
              </div>

              <div className="text-center flex flex-col">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#303E55', marginBottom: '32px' }}>
                  <Target className="w-10 h-10 text-accent" />
                </div>
                <div className="bg-white rounded-lg p-lg border-2 border-muted flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-navy" style={{ marginBottom: '16px' }}>2. Set Rewards</h3>
                  <p className="text-sm font-semibold" style={{ color: '#33BECC', marginBottom: '24px' }}>
                    Build your rewards program
                  </p>
                  <p className="text-sm text-text/70 leading-relaxed">
                    Use our dashboard to create rewards that matter to your community.
                    <br /><br />
                    Free classes, exclusive events, discounts, and more.
                  </p>
                </div>
              </div>

              <div className="text-center flex flex-col">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#33BECC', marginBottom: '32px' }}>
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div className="bg-white rounded-lg p-lg border-2 border-muted flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-navy" style={{ marginBottom: '16px' }}>3. Launch</h3>
                  <p className="text-sm font-semibold" style={{ color: '#33BECC', marginBottom: '24px' }}>
                    Streamlined launch process
                  </p>
                  <p className="text-sm text-text/70 leading-relaxed">
                    We handle the technology setup. You focus on your community.
                    <br /><br />
                    Launch your connected experience efficiently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Lifestyle Video Showcase */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="w-full">
          <video 
            className="w-full h-auto"
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/videos/lifestyle-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Starter Kits - Side by Side Cards */}
      <Section 
        className="py-5xl"
        style={{ backgroundColor: '#F7F7F7' }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-xl">Starter Kits</h2>
          <h3 className="text-xl md:text-2xl font-semibold mb-4xl" style={{ color: '#33BECC' }}>Choose the package that fits your community</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3xl max-w-5xl mx-auto">
            {/* Core Kit */}
            <Card className="hover:shadow-xl transition-shadow border-2 border-muted" style={{ backgroundColor: '#FFFFFF' }}>
              <CardHeader>
                <div className="flex items-center justify-between mb-md">
                  <CardTitle className="text-navy text-3xl font-bold">Core Kit</CardTitle>
                  <Badge className="bg-accent text-navy font-semibold">Most Popular</Badge>
                </div>
                <CardDescription className="text-lg font-semibold" style={{ color: '#33BECC' }}>
                  For gyms and smaller communities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ marginBottom: '24px' }}>
                  <p className="text-4xl font-bold text-navy mb-sm">$15-45*</p>
                  <p className="text-sm text-text/70">estimated per unit (volume pricing)</p>
                </div>
              <ul className="mb-xl" style={{ paddingLeft: '0' }}>
                <li className="text-sm text-navy" style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0', top: '0', color: '#33BECC', fontWeight: 'bold' }}>• </span>
                  100+ units minimum
                </li>
                <li className="text-sm text-navy" style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0', top: '0', color: '#33BECC', fontWeight: 'bold' }}>• </span>
                  Choice of t-shirts, tanks, hoodies, or hats
                </li>
                <li className="text-sm text-navy" style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0', top: '0', color: '#33BECC', fontWeight: 'bold' }}>• </span>
                  Custom branded design with your logo
                </li>
                <li className="text-sm text-navy" style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0', top: '0', color: '#33BECC', fontWeight: 'bold' }}>• </span>
                  NFC technology embedded
                </li>
                <li className="text-sm text-navy" style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0', top: '0', color: '#33BECC', fontWeight: 'bold' }}>• </span>
                  Basic rewards dashboard
                </li>
                <li className="text-sm text-navy" style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0', top: '0', color: '#33BECC', fontWeight: 'bold' }}>• </span>
                  Email support
                </li>
              </ul>
                <p className="text-sm text-navy mb-md text-center font-semibold" style={{ marginTop: '24px' }}>Start building your community kit today</p>
                <Button 
                  className="w-full bg-gray-200 hover:bg-gray-300 text-black font-semibold shadow-md"
                  asChild
                >
                  <Link href="/club/get-started">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Kit */}
            <Card className="hover:shadow-xl transition-shadow border-2 border-accent" style={{ backgroundColor: '#303E55' }}>
              <CardHeader>
                <div className="flex items-center justify-between mb-md">
                  <CardTitle className="text-accent text-3xl font-bold">Pro Kit</CardTitle>
                  <Badge style={{ backgroundColor: '#33BECC', color: '#303E55' }} className="font-semibold">Premium</Badge>
                </div>
                <CardDescription className="text-lg font-semibold" style={{ color: '#33BECC' }}>
                  For golf courses and premium clubs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ marginBottom: '24px' }}>
                  <p className="text-4xl font-bold text-accent mb-sm">$25-50*</p>
                  <p className="text-sm text-white/70">estimated per unit (volume pricing)</p>
                </div>
              <ul className="mb-xl" style={{ paddingLeft: '0' }}>
                <li className="text-sm text-white" style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0', top: '0', color: '#33BECC', fontWeight: 'bold' }}>• </span>
                  500+ units minimum
                </li>
                <li className="text-sm text-white" style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0', top: '0', color: '#33BECC', fontWeight: 'bold' }}>• </span>
                  Premium fabrics and styles
                </li>
                <li className="text-sm text-white" style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0', top: '0', color: '#33BECC', fontWeight: 'bold' }}>• </span>
                  Custom design consultation
                </li>
                <li className="text-sm text-white" style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0', top: '0', color: '#33BECC', fontWeight: 'bold' }}>• </span>
                  NFC technology embedded
                </li>
                <li className="text-sm text-white" style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0', top: '0', color: '#33BECC', fontWeight: 'bold' }}>• </span>
                  Advanced rewards dashboard + analytics
                </li>
                <li className="text-sm text-white" style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0', top: '0', color: '#33BECC', fontWeight: 'bold' }}>• </span>
                  Dedicated account support
                </li>
              </ul>
                <p className="text-sm text-white mb-md text-center font-semibold" style={{ marginTop: '24px' }}>Elevate your community experience</p>
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-navy font-semibold shadow-md"
                  asChild
                >
                  <Link href="/club/get-started">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

        <div className="text-center mt-lg" style={{ marginBottom: '24px' }}>
          <p className="text-sm text-text/70 italic">*Final price available at time of order</p>
        </div>

          {/* Enterprise Call-Out */}
          <Card className="border-2 border-navy shadow-xl mt-5xl max-w-3xl mx-auto" style={{ backgroundColor: '#303E55' }}>
            <CardContent className="p-xl text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-accent mb-md">
                Need 1000+ Units?
              </h3>
              <p className="text-base text-white" style={{ marginBottom: '32px' }}>
                Schedule a call to explore custom pricing and enterprise solutions tailored to your needs.
              </p>
              <Button 
                size="lg"
                className="bg-accent hover:brightness-110 transition text-navy font-semibold shadow-md"
                asChild
              >
                <Link href="/intake">Let's Connect</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Proven Results - Centered Icons Format */}
      <Section 
        className="py-5xl"
        style={{ backgroundColor: '#F7F7F7' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '48px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <BarChart3 className="w-10 h-10 text-navy" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy text-center" style={{ marginBottom: '24px' }}>Proven Results</h2>
          <h3 className="text-2xl md:text-3xl font-bold text-center" style={{ color: '#33BECC', marginBottom: '64px' }}>What partners see and members feel</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto" style={{ gap: '96px' }}>
            <div className="text-center" style={{ marginBottom: '48px' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#33BECC', marginBottom: '24px' }}>
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-navy" style={{ marginBottom: '12px' }}>Higher Engagement</h3>
              <p className="text-base font-semibold" style={{ color: '#33BECC', marginBottom: '16px' }}>
                More check-ins, more visits
              </p>
              <p className="text-sm text-text/70 leading-relaxed">
                Members tap in more often, creating consistent touchpoints that drive loyalty and repeat visits to your facility.
              </p>
            </div>

            <div className="text-center" style={{ marginBottom: '48px' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#303E55', marginBottom: '24px' }}>
                <Heart className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-navy" style={{ marginBottom: '12px' }}>Stronger Loyalty</h3>
              <p className="text-base font-semibold" style={{ color: '#33BECC', marginBottom: '16px' }}>
                Real rewards, real connections
              </p>
              <p className="text-sm text-text/70 leading-relaxed">
                Tangible rewards that members actually want, delivered instantly through their connected apparel. No more forgotten cards.
              </p>
            </div>

            <div className="text-center" style={{ marginBottom: '48px' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#33BECC', marginBottom: '24px' }}>
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-navy" style={{ marginBottom: '12px' }}>Streamlined Setup</h3>
              <p className="text-base font-semibold" style={{ color: '#33BECC', marginBottom: '16px' }}>
                Efficient implementation process
              </p>
              <p className="text-sm text-text/70 leading-relaxed">
                We handle the technology and production. You focus on your community. Get up and running efficiently with minimal hassle.
              </p>
            </div>

            <div className="text-center" style={{ marginBottom: '48px' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: '#303E55', marginBottom: '24px' }}>
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-navy" style={{ marginBottom: '12px' }}>Easy Management</h3>
              <p className="text-base font-semibold" style={{ color: '#33BECC', marginBottom: '16px' }}>
                Simple dashboard, powerful features
              </p>
              <p className="text-sm text-text/70 leading-relaxed">
                Track engagement, manage rewards, and see what's working with our intuitive platform. No technical expertise required.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section 
        className="py-5xl"
        style={{ backgroundColor: '#303E55' }}
      >
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-accent mb-xl">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white font-semibold" style={{ marginBottom: '64px' }}>
            Launch your community's connected experience. Start with our simple onboarding flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-md justify-center items-center">
            <Button 
              size="lg" 
              className="min-w-[200px] text-navy font-semibold shadow-lg"
              style={{ backgroundColor: '#33BECC' }}
              asChild
            >
              <Link href="/club/get-started">Build Your Kit</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="min-w-[200px] border-2 border-white bg-transparent text-white hover:bg-white hover:text-navy shadow-lg font-semibold"
              asChild
            >
              <Link href="/intake">Contact Us</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Visual Divider */}
      <section style={{ backgroundColor: '#303E55', paddingTop: '64px', paddingBottom: '64px' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div style={{ height: '2px', backgroundColor: '#33BECC', opacity: 0.5 }}></div>
        </div>
      </section>
    </div>
  );
}
