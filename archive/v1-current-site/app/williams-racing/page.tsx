'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SEO from '@/components/SEO';
import { Hand, Rocket, Gift, Smartphone, MapPin, Users, BarChart3, Shield, Droplets, Lock } from 'lucide-react';

export default function WilliamsRacingPage() {
  // Track page visit (same pattern as Indy Ignite)
  useEffect(() => {
    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pathname: '/williams-racing',
        referrer: document.referrer || 'Direct visit',
        userAgent: navigator.userAgent,
      }),
    }).catch((err) => {
      console.error('Failed to track visit:', err);
      // Silently fail - don't interrupt user experience
    });
  }, []);

  return (
    <>
      <SEO 
        pathname="/williams-racing" 
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Williams Racing x Vonga",
          description: "Live Connected. Williams Racing Everywhere. Turn your team apparel into an always-on fan touchpoint. From the Paddock to the rest of the world.",
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
            {/* Primary Blue Line - Horizontal */}
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-0.5 bg-gradient-to-r from-transparent via-[#00A0E1] to-transparent opacity-60"
              style={{ boxShadow: '0 0 20px rgba(0, 160, 225, 0.5)' }}
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
            {/* Additional Blue Diagonal Line */}
            <motion.div
              className="absolute top-1/3 right-1/3 w-80 h-0.5 bg-gradient-to-r from-transparent via-[#00A0E1] to-transparent opacity-50"
              style={{ boxShadow: '0 0 15px rgba(0, 160, 225, 0.4)' }}
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
            {/* Vertical Blue Line */}
            <motion.div
              className="absolute bottom-1/5 left-1/5 w-0.5 h-64 bg-gradient-to-b from-transparent via-[#00A0E1] to-transparent opacity-50"
              style={{ boxShadow: '0 0 15px rgba(0, 160, 225, 0.4)' }}
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
              className="absolute bottom-1/6 right-1/6 w-2 h-2 rounded-full bg-[#00A0E1] opacity-60"
              style={{ boxShadow: '0 0 20px rgba(0, 160, 225, 0.8)' }}
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
              Live Connected.
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed mb-10 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Williams Racing Everywhere.
            </motion.p>
            <motion.p
              className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Turn your team apparel into an always-on fan touchpoint.<br />
              From the Paddock to the rest of the world.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-[#00A0E1] to-[#33BECC] hover:from-[#00A0E1]/90 hover:to-[#33BECC]/90 text-white"
                asChild
              >
                <Link href="#see-it-in-action">See the Experience</Link>
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
                  You have a massive global community. But once the race ends or the app closes, the connection breaks.
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
                  Inside the Track: ~100k Fans.
                </p>
                <p>
                  Outside the Track: Millions of Fans.
                </p>
                <p className="text-[#33BECC] font-semibold">
                  Vonga turns the jersey itself into the bridge.
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
                The Garment is the Interface.
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                No apps to download. No logins. Just a tap.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  title: "Wear",
                  text: "Premium Williams apparel designed for race day and travel days.",
                  icon: Hand,
                },
                {
                  title: "Tap",
                  text: "Embedded NFC triggers a tailored mobile experience instantly.",
                  icon: Rocket,
                },
                {
                  title: "Unlock",
                  text: "Fans unlock telemetry data, pit lane videos, and partner rewards.",
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
                        <source src="/videos/williams-experience.mp4" type="video/mp4" />
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
              This is what a fan sees. Simple, fast, and fully branded to Williams Racing.
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
                The Paddock in Their Pocket.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  title: "Extend Fan Zones Beyond the Track",
                  text: "Your Fan Zones create incredible moments at race weekends. Vonga lets fans take that energy home. Tap their Williams apparel to unlock exclusive Fan Zone content, behind-the-scenes access, and special offers—long after they've left the venue.",
                },
                {
                  title: "Bridge Physical and Digital Experiences",
                  text: "Connect the in-person Fan Zone experience with ongoing digital engagement. Fans who visit your Fan Zone can tap their apparel later to access exclusive content, partner rewards, and community features that keep them connected to Williams Racing.",
                },
                {
                  title: "Measure Fan Zone Impact",
                  text: "Track which Fan Zone visitors become your most engaged fans. See how apparel taps correlate with Fan Zone attendance, and use that data to optimize future experiences and prove ROI to partners.",
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  className="bg-[#1a1a1a] border border-white/10 rounded-lg p-8 hover:border-[#00A0E1]/50 transition-all duration-300"
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
                Built for Real Life.
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
                  <span className="font-semibold text-white">Wash-Tested:</span> Laundry safe and permanent.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  <span className="font-semibold text-white">Secure:</span> Each tag is unique and non-clonable.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  <span className="font-semibold text-white">No QR Codes:</span> It&apos;s premium tech, not a restaurant menu.
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
                Ready to pilot?
              </h2>
              <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed">
                Let us know where we can send a sample so you can experience this for yourself.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-[#00A0E1] to-[#33BECC] hover:from-[#00A0E1]/90 hover:to-[#33BECC]/90 text-white"
                asChild
              >
                <Link href="/williams-racing/request-sample">Request a Sample</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
