'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SEO from '@/components/SEO';
import { Hand, Rocket, Gift } from 'lucide-react';
import { useEffect } from 'react';

export default function IndyElevenPage() {
  // Track page visit
  useEffect(() => {
    // Track visit when page loads
    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pathname: '/indy-eleven',
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
        pathname="/indy-eleven" 
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Indy Eleven Pitch - Vonga",
          description: "Live Connected. Indy Everywhere. Turn the Boys in Blue into an always-on fan touchpoint.",
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
            {/* Primary Coral Line - Horizontal */}
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-0.5 bg-gradient-to-r from-transparent via-[#F5856E] to-transparent opacity-60"
              style={{ boxShadow: '0 0 20px rgba(245, 133, 110, 0.5)' }}
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
            {/* Additional Coral Diagonal Line */}
            <motion.div
              className="absolute top-1/3 right-1/3 w-80 h-0.5 bg-gradient-to-r from-transparent via-[#F5856E] to-transparent opacity-50"
              style={{ boxShadow: '0 0 15px rgba(245, 133, 110, 0.4)' }}
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
            {/* Vertical Coral Line */}
            <motion.div
              className="absolute bottom-1/5 left-1/5 w-0.5 h-64 bg-gradient-to-b from-transparent via-[#F5856E] to-transparent opacity-50"
              style={{ boxShadow: '0 0 15px rgba(245, 133, 110, 0.4)' }}
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
              className="absolute bottom-1/6 right-1/6 w-2 h-2 rounded-full bg-[#F5856E] opacity-60"
              style={{ boxShadow: '0 0 20px rgba(245, 133, 110, 0.8)' }}
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
              style={{ color: '#33BECC' }}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Live Connected.<br />Indy Everywhere.
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed mb-10 max-w-4xl mx-auto"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Turn the Boys in Blue into an always-on fan touchpoint.<br />From The Mike to Mass Ave, and everywhere in between.
            </motion.p>
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                variant="primary"
                size="lg"
                className="bg-[#F5856E] hover:bg-[#F5856E]/90 text-white"
                asChild
              >
                <Link href="#see-it-in-action">See It in Action</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: THE GAP */}
        <section className="px-6 md:px-12 lg:px-20 py-24 md:py-40 bg-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
              <motion.div
                initial={{ opacity: 1, x: 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]"
              >
                {/* Inside the Gates visual */}
                <div className="absolute inset-0">
                  <img
                    src="/images/microsites/eleven-inside.png"
                    alt="Packed Indy Eleven stadium crowd"
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0a1422]/60 via-[#0a1422]/40 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-b from-[#33BECC]/10 to-transparent flex items-end justify-center p-8">
                    <div className="text-center">
                      <div className="text-6xl font-bold mb-2" style={{ color: '#33BECC' }}>10,000</div>
                      <div className="text-xl text-white/80">Fans</div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                    <p className="text-white font-semibold">Inside the Gates: 10,000 Fans.</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 1, x: 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]"
              >
                {/* Outside the Gates visual */}
                <div className="absolute inset-0">
                  <img
                    src="/images/microsites/eleven-outside.png"
                    alt="Indy city map with glowing fan nodes"
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0a1422]/65 via-[#0a1422]/45 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F5856E]/8 to-[#33BECC]/8"></div>
                    {/* Glowing nodes */}
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-[#33BECC] animate-pulse shadow-lg" style={{ boxShadow: '0 0 20px rgba(51,190,204,0.8)' }}></div>
                    <div className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full bg-[#F5856E] animate-pulse shadow-lg" style={{ boxShadow: '0 0 20px rgba(245,133,110,0.8)' }}></div>
                    <div className="absolute bottom-1/4 left-1/2 w-3 h-3 rounded-full bg-[#33BECC] animate-pulse shadow-lg" style={{ boxShadow: '0 0 20px rgba(51,190,204,0.8)' }}></div>
                    <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-[#F5856E] animate-pulse shadow-lg" style={{ boxShadow: '0 0 20px rgba(245,133,110,0.8)' }}></div>
                    <div className="absolute bottom-1/3 left-1/3 w-3 h-3 rounded-full bg-[#33BECC] animate-pulse shadow-lg" style={{ boxShadow: '0 0 20px rgba(51,190,204,0.8)' }}></div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                    <p className="text-white font-semibold">Outside the Gates: 150,000+ Digital Fans.</p>
                  </div>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
                You&apos;ve built a massive community. But once they leave the stadium or close Instagram, the connection breaks. Current fan engagement stops at the exit. Vonga travels with them.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 3: HOW IT WORKS */}
        <section id="how-it-works" className="px-6 md:px-12 lg:px-20 py-24 md:py-40 bg-[#0f0f0f]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                The Crest is the Interface.
              </h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
                No apps to download. No logins to remember. Just a tap.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  title: "Wear",
                  text: "Premium gear designed for the Brickyard Battalion and the street.",
                  icon: Hand,
                },
                {
                  title: "Tap",
                  text: "Embedded NFC triggers an exclusive \"Boys in Blue\" mobile experience.",
                  icon: Rocket,
                },
                {
                  title: "Unlock",
                  text: "Fans get locker room access, partner rewards, and matchday upgrades instantly.",
                  icon: Gift,
                },
              ].map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-[#1a1a1a] border border-white/10 rounded-lg p-8 md:p-10 hover:border-[#33BECC]/50 hover:bg-[#1a1a1a]/80 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#33BECC]/20"
                    initial={{ opacity: 1, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-[#33BECC]/20 border border-[#33BECC]/30 shadow-lg">
                      <IconComponent className="w-8 h-8 text-[#33BECC]" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{card.title}</h3>
                    <p className="text-lg text-white/80 leading-relaxed">{card.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 4: THE PLATFORM */}
        <section className="px-6 md:px-12 lg:px-20 py-24 md:py-40 bg-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Control the Engagement. Measure the Behavior.
              </h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
                Move beyond impressions. See exactly who is tapping, where they are, and what offers drive value for your sponsors.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {[
                {
                  title: "Campaign Builder",
                  text: "Change content from \"Matchday Hype\" to \"Post-Match Analysis\" instantly.",
                  color: "#33BECC",
                },
                {
                  title: "Sponsor Value",
                  text: "Drive clicks to partners like Keystone or Honda, not just logo views.",
                  color: "#F5856E",
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  className="bg-[#0f0f0f] border border-white/10 rounded-lg p-8 md:p-10 hover:border-[#33BECC]/50 hover:bg-[#0f0f0f]/80 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#33BECC]/20"
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white" style={{ color: card.color }}>
                    {card.title}
                  </h3>
                  <p className="text-lg text-white/80 leading-relaxed">{card.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4.5: VIDEO */}
        <section id="see-it-in-action" className="px-6 md:px-12 lg:px-20 py-24 md:py-40 bg-[#1a1a1a]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 1, y: 0 }}
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
              initial={{ opacity: 1, scale: 1 }}
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
              initial={{ opacity: 1 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              This is what a fan sees. Simple, fast, and fully branded to the Boys in Blue.
            </motion.p>
          </div>
        </section>

        {/* SECTION 5: USE CASE */}
        <section className="px-6 md:px-12 lg:px-20 py-24 md:py-40 bg-[#0f0f0f]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                The Season Pass on a Sleeve.
              </h2>
            </motion.div>

            <motion.div
              className="bg-[#1a1a1a] border border-white/10 rounded-lg p-8 md:p-12 shadow-xl"
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed">
                Imagine a fan at a watch party in Broad Ripple tapping their jersey during an away match. They instantly unlock a &quot;Check-In&quot; reward, enter a raffle for signed boots, and get a digital coupon for the bar they are sitting in. You get the data; they get the magic.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 6: THE TECH */}
        <section className="px-6 md:px-12 lg:px-20 py-24 md:py-40 bg-[#1a1a1a]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Built for the Battalion.
              </h2>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  <span className="font-semibold text-white">Wash-Tested:</span> Throw it in the laundry. The tech survives.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  <span className="font-semibold text-white">Secure:</span> Non-clonable tags ensure authenticity.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  <span className="font-semibold text-white">Permanent:</span> No QR codes to fade or peel.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 7: FOOTER */}
        <section className="px-6 md:px-12 lg:px-20 py-24 md:py-40 bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white">
                Ready to pilot?
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-white/80 mb-12 leading-relaxed">
                We can have an Indy Eleven prototype in your hands in 14 days.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="bg-[#F5856E] hover:bg-[#F5856E]/90 text-white"
                asChild
              >
                <Link href="/intake">Schedule Strategy Session</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
