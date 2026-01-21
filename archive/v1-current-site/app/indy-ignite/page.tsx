'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SEO from '@/components/SEO';
import { Hand, Rocket, Gift } from 'lucide-react';
import { useEffect } from 'react';

export default function IndyIgnitePage() {
  // Track page visit
  useEffect(() => {
    // Track visit when page loads
    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pathname: '/indy-ignite',
        referrer: document.referrer || 'Direct visit',
        userAgent: navigator.userAgent
      })
    }).catch(err => {
      console.error('Failed to track visit:', err);
      // Silently fail - don't interrupt user experience
    });
  }, []);

  return (
    <>
      <SEO 
        pathname="/indy-ignite" 
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Indy Ignite x Vonga",
          description: "Beyond the Court. You're building a new legacy in Indy. Vonga makes sure your fans take it with them—everywhere they go.",
        }} 
      />
      <main className="bg-[#0f0f0f] text-white min-h-screen overflow-x-hidden">
        {/* SECTION 1: HERO */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background - Glowing Lines */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Primary Aqua Line - Horizontal */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-0.5 bg-gradient-to-r from-transparent via-[#33BECC] to-transparent opacity-60"
              style={{ boxShadow: '0 0 20px rgba(51, 190, 204, 0.5)' }}
              animate={{
                x: [0, 100, 0],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Primary Orange Line - Horizontal */}
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-0.5 bg-gradient-to-r from-transparent via-[#FF671F] to-transparent opacity-60"
              style={{ boxShadow: '0 0 20px rgba(255, 103, 31, 0.5)' }}
              animate={{
                x: [0, -100, 0],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            {/* Rotating Diagonal Aqua Line */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-64 h-0.5 bg-gradient-to-r from-transparent via-[#33BECC] to-transparent opacity-50"
              style={{ boxShadow: '0 0 15px rgba(51, 190, 204, 0.4)' }}
              animate={{
                rotate: [45, 225, 45],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Additional Orange Diagonal Line */}
            <motion.div
              className="absolute top-1/3 right-1/3 w-80 h-0.5 bg-gradient-to-r from-transparent via-[#FF671F] to-transparent opacity-50"
              style={{ boxShadow: '0 0 15px rgba(255, 103, 31, 0.4)' }}
              animate={{
                rotate: [-30, 150, -30],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            {/* Vertical Aqua Line */}
            <motion.div
              className="absolute top-1/5 right-1/5 w-0.5 h-64 bg-gradient-to-b from-transparent via-[#33BECC] to-transparent opacity-50"
              style={{ boxShadow: '0 0 15px rgba(51, 190, 204, 0.4)' }}
              animate={{
                y: [0, 50, 0],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            {/* Vertical Orange Line */}
            <motion.div
              className="absolute bottom-1/5 left-1/5 w-0.5 h-64 bg-gradient-to-b from-transparent via-[#FF671F] to-transparent opacity-50"
              style={{ boxShadow: '0 0 15px rgba(255, 103, 31, 0.4)' }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            />
            {/* Glowing Particles/Orbs */}
            <motion.div
              className="absolute top-1/6 left-1/6 w-2 h-2 rounded-full bg-[#33BECC] opacity-60"
              style={{ boxShadow: '0 0 20px rgba(51, 190, 204, 0.8)' }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.8, 0.4],
                x: [0, 30, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/6 right-1/6 w-2 h-2 rounded-full bg-[#FF671F] opacity-60"
              style={{ boxShadow: '0 0 20px rgba(255, 103, 31, 0.8)' }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.8, 0.4],
                x: [0, -30, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            <motion.div
              className="absolute top-2/3 left-2/3 w-1.5 h-1.5 rounded-full bg-[#33BECC] opacity-50"
              style={{ boxShadow: '0 0 15px rgba(51, 190, 204, 0.6)' }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 md:px-12 lg:px-20 max-w-6xl mx-auto">
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Beyond the Court.
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed mb-10 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              You&apos;re building a new legacy in Indy. Vonga makes sure your fans take it with them—everywhere they go.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                variant="primary"
                size="lg"
                className="bg-[#FF671F] hover:bg-[#FF671F]/90 text-white"
                asChild
              >
                <Link href="#see-it-in-action">See How It Works</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: THE OPPORTUNITY */}
        <section className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  The game ends. The connection shouldn&apos;t.
                </h2>
              </motion.div>
              <motion.div
                className="space-y-4 text-lg md:text-xl text-white/80 leading-relaxed"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p>
                  You have a distinct advantage: a fresh fanbase ready to rally behind Indy&apos;s newest pro team. But standard merch is passive. A hoodie is usually just cotton.
                </p>
                <p className="text-[#33BECC] font-semibold">
                  We change that.
                </p>
                <p>
                  Vonga turns Ignite apparel into an on-body engagement surface. It bridges the gap between the electric energy inside the Fishers Event Center and the rest of your fans&apos; lives.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 3: HOW IT WORKS */}
        <section id="how-it-works" className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-[#0f0f0f]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Tech that stays out of the way.
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                We don&apos;t do &quot;smart&quot; gadgets that feel like homework. We do frictionless engagement.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  title: "Tap the tag",
                  text: "An embedded NFC chip in the sleeve or hem creates the physical-to-digital bridge. Wash-proof and permanent.",
                  icon: Hand,
                },
                {
                  title: "Launch the experience",
                  text: "Instantly opens a mobile site. No app store. No downloads.",
                  icon: Rocket,
                },
                {
                  title: "Get the goods",
                  text: "Fans access rewards, exclusive stats, exclusive content, and partner offers immediately.",
                  icon: Gift,
                },
              ].map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-[#1a1a1a] border border-white/10 rounded-lg p-8 hover:border-[#33BECC]/50 transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-[#33BECC]/20 border border-[#33BECC]/30">
                      <IconComponent className="w-8 h-8 text-[#33BECC]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">{card.title}</h3>
                    <p className="text-white/70 leading-relaxed">{card.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 4: VIDEO */}
        <section id="see-it-in-action" className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-[#1a1a1a]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                See it in action.
              </h2>
            </motion.div>

            <motion.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Smartphone Frame */}
              <div className="relative w-full max-w-[256px] md:max-w-[307px]">
                {/* Phone Frame Outer */}
                <div className="relative bg-[#1a1a1a] rounded-[3rem] p-3 shadow-2xl border border-white/20">
                  {/* Phone Screen Bezel */}
                  <div className="bg-black rounded-[2.5rem] overflow-hidden">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1a1a] rounded-b-2xl z-10"></div>
                    
                    {/* Screen Content */}
                    <div className="relative aspect-[15/32] bg-[#0f0f0f] overflow-hidden flex items-center justify-center">
                      {/* Video */}
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-contain"
                      >
                        <source src="/videos/ignite-experience.mp4" type="video/mp4" />
                      </video>
                    </div>
                    
                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-10"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.p
              className="text-center text-white/60 text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              This is what a fan sees. Simple, fast, and fully branded to the Ignite.
            </motion.p>
          </div>
        </section>

        {/* SECTION 5: USE CASES */}
        <section className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-[#0f0f0f]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                3 Ways to Power the Playoffs.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  title: "The \"Championship Chase\" Kit",
                  text: "A limited-edition drop for the playoff run. Fans who wear it tap to access bracket challenges, away-game watch party locations, and priority access to Finals tickets.",
                },
                {
                  title: "High-Stakes Sponsor ROI",
                  text: "Playoff eyeballs are valuable. Don&apos;t waste them on static logos. Put a partner offer directly into the sleeve of every fan in the arena. We track the taps; you prove the value.",
                },
                {
                  title: "The Travel Team",
                  text: "When the squad hits the road for away games, the shirt keeps the connection alive. Send exclusive locker room content or travel updates directly to the fan&apos;s phone when they wear their Ignite apparel.",
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  className="bg-[#1a1a1a] border border-white/10 rounded-lg p-8 hover:border-[#FF671F]/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-2xl font-bold mb-4 text-white">{card.title}</h3>
                  <p className="text-white/70 leading-relaxed">{card.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: THE TECH */}
        <section className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-[#1a1a1a]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Built for the real world.
              </h2>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  <span className="font-semibold text-white">No QR Codes:</span> It&apos;s premium tech, not a restaurant menu.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  <span className="font-semibold text-white">Secure:</span> Each tag is unique and impossible to fake.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  <span className="font-semibold text-white">Data You Own:</span> You keep the relationship with your fans.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 7: FOOTER */}
        <section className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Let&apos;s build this together.
              </h2>
              <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed">
                We&apos;re local. We&apos;re ready. Let&apos;s turn the city orange.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="bg-[#FF671F] hover:bg-[#FF671F]/90 text-white"
                asChild
              >
                <Link href="/intake">Let&apos;s Connect</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
