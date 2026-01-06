'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SEO from '@/components/SEO';
import { useEffect } from 'react';

export default function CadillacF1Page() {
  // Track page visit
  useEffect(() => {
    // Track visit when page loads
    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pathname: '/cadillac-f1',
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
        pathname="/cadillac-f1" 
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Cadillac F1 × Vonga",
          description: "Building the next generation of global F1 fandom. Vonga brings Cadillac F1 fans closer. Everywhere they are.",
        }} 
      />
      <main className="bg-[#0f0f0f] text-white min-h-screen overflow-x-hidden">
        {/* SECTION 1: HERO */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated F1 Track Background */}
          <div className="absolute inset-0 overflow-hidden">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* F1 Track Path - Cyan */}
              <motion.path
                d="M 200 400 L 400 400 Q 500 400 550 350 Q 600 300 600 250 Q 600 200 650 200 L 800 200 Q 850 200 900 250 Q 950 300 1000 300 L 1000 500 Q 950 500 900 550 Q 850 600 800 600 L 400 600 Q 300 600 250 550 Q 200 500 200 450 Z"
                fill="none"
                stroke="#33BECC"
                strokeWidth="2"
                opacity="0.6"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(51, 190, 204, 0.8))',
                }}
                animate={{
                  pathLength: [0, 1, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* F1 Track Path - Coral (offset) */}
              <motion.path
                d="M 250 400 L 450 400 Q 550 400 600 350 Q 650 300 650 250 Q 650 200 700 200 L 850 200 Q 900 200 950 250 Q 1000 300 1050 300 L 1050 500 Q 1000 500 950 550 Q 900 600 850 600 L 450 600 Q 350 600 300 550 Q 250 500 250 450 Z"
                fill="none"
                stroke="#FF7F50"
                strokeWidth="2"
                opacity="0.6"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(255, 127, 80, 0.8))',
                }}
                animate={{
                  pathLength: [0, 1, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
              
              {/* Track Markers/Checkpoints - Cyan */}
              {[
                { x: 300, y: 400 },
                { x: 575, y: 275 },
                { x: 900, y: 275 },
                { x: 1000, y: 400 },
                { x: 900, y: 575 },
                { x: 325, y: 575 },
              ].map((point, index) => (
                <motion.circle
                  key={`cyan-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="#33BECC"
                  opacity="0.7"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(51, 190, 204, 1))',
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5,
                  }}
                />
              ))}
              
              {/* Track Markers/Checkpoints - Coral */}
              {[
                { x: 350, y: 400 },
                { x: 625, y: 275 },
                { x: 950, y: 275 },
                { x: 1050, y: 400 },
                { x: 950, y: 575 },
                { x: 375, y: 575 },
              ].map((point, index) => (
                <motion.circle
                  key={`coral-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="#FF7F50"
                  opacity="0.7"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255, 127, 80, 1))',
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5 + 0.3,
                  }}
                />
              ))}
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 md:px-12 lg:px-20 max-w-6xl mx-auto">
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Cadillac F1 × Vonga
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed mb-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Building the next generation of global F1 fandom.
            </motion.p>
            <motion.div
              className="text-lg md:text-xl text-white/70 mb-10 max-w-3xl mx-auto space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <p>Formula 1 is global. Fandom is digital.</p>
              <p>But connection still stops at the gate.</p>
              <p className="text-[#33BECC] font-semibold">Vonga brings Cadillac F1 fans closer. Everywhere they are.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                variant="primary"
                size="lg"
                className="bg-[#FF7F50] hover:bg-[#FF7F50]/90 text-white"
                asChild
              >
                <Link href="/intake">Let&apos;s Connect</Link>
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
                  F1 Fandom Is Massive and Mostly Untapped
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
                  The average Formula 1 team reaches more than <span className="font-semibold text-white">100 million fans worldwide</span>.
                </p>
                <p>
                  Yet <span className="font-semibold text-white">99% of fans will never attend a Grand Prix</span>.
                </p>
                <p>
                  They follow drivers.<br />
                  They watch races.<br />
                  They wear the merch.
                </p>
                <p>
                  But they have no persistent way to participate, engage, or feel recognized as fans.
                </p>
                <p className="text-[#33BECC] font-semibold text-center">
                  Today, global reach is easy.<br />
                  Global connection is not.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE GAP */}
        <section className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-[#0f0f0f]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Awareness Isn&apos;t Engagement
              </h2>
            </motion.div>

            <motion.div
              className="space-y-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  Social media delivers reach, but attention disappears in feeds.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  Team apps introduce friction and suffer from low retention.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  Merch carries logos, but doesn&apos;t carry experiences.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  Race-week activations reach the smallest audience, not the biggest.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  Sponsorship environments are crowded, reducing recall and real interaction.
                </p>
              </div>
            </motion.div>

            <motion.p
              className="text-xl text-white/80 leading-relaxed text-center font-bold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              F1 has mastered visibility, but lacks a system for sustained fan engagement beyond race weekend.
            </motion.p>
          </div>
        </section>

        {/* SECTION 4: THE SOLUTION */}
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
                  Connected Apparel, Built for Fans
                </h2>
                <div className="w-full aspect-video bg-[#0f0f0f] border border-white/10 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src="/images/microsites/cadillac-apparel.png"
                    alt="Cadillac F1 connected apparel"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <motion.div
                className="space-y-4 text-lg md:text-xl text-white/80 leading-relaxed"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p>
                  Vonga turns Cadillac F1 apparel into a direct connection between the team and its fans.
                </p>
                <p>
                  Each piece comes with an embedded NFC chip. With a simple tap, fans unlock:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#33BECC]">•</span>
                    <span>Exclusive content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#33BECC]">•</span>
                    <span>Race-week challenges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#33BECC]">•</span>
                    <span>Digital collectibles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#33BECC]">•</span>
                    <span>Rewards and loyalty progression</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#33BECC]">•</span>
                    <span>Location-based experiences: at races, in cities, or at home</span>
                  </li>
                </ul>
                <p className="text-[#33BECC] font-semibold text-center">
                  No app.<br />
                  No friction.<br />
                  Just connection.
                </p>
                <p>
                  This is fandom that lives with the fan, not just on race day.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 4.5: VIDEO */}
        <section className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-[#0f0f0f]">
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
                        <source src="/videos/cadillacf1-experience.mp4" type="video/mp4" />
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
              This is what a fan sees. Simple, fast, and fully branded to Cadillac F1.
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
                How Cadillac F1 Fans Engage
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {[
                {
                  title: "Global Fans",
                  text: "Fans tap their apparel anywhere in the world to access content, challenges, and season-long engagement.",
                },
                {
                  title: "Race Weekends",
                  text: "At-track and city-wide activations turn race weekends into immersive fan experiences: inside and outside the circuit.",
                },
                {
                  title: "GP Cities",
                  text: "Watch parties, pop-ups, and local events become part of the official Cadillac F1 experience.",
                },
                {
                  title: "Everyday Fandom",
                  text: "Fans stay connected between races, not just during them.",
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  className="bg-[#1a1a1a] border border-white/10 rounded-lg p-8 hover:border-[#FF7F50]/50 transition-all duration-300"
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

        {/* SECTION 6: THE PILOT PROGRAM */}
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
                A Four-Race Pilot. Built to Scale.
              </h2>
            </motion.div>

            <motion.div
              className="space-y-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xl text-white/80 leading-relaxed">
                To prove the model, Cadillac F1 and Vonga can launch a multi-race pilot program.
              </p>
              
              <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-6 space-y-4">
                <h3 className="text-2xl font-bold text-white mb-4">Pilot outline:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="text-[#33BECC] text-xl font-bold mt-1">•</div>
                    <p className="text-lg text-white/80">4 Grand Prix weekends</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-[#33BECC] text-xl font-bold mt-1">•</div>
                    <p className="text-lg text-white/80">5,000+ pieces of connected apparel</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-[#33BECC] text-xl font-bold mt-1">•</div>
                    <p className="text-lg text-white/80">Global online drop plus race-week distribution</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-[#33BECC] text-xl font-bold mt-1">•</div>
                    <p className="text-lg text-white/80">City-level engagement beyond the circuit</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-[#33BECC] text-xl font-bold mt-1">•</div>
                    <p className="text-lg text-white/80">Fully measurable fan interaction</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-lg text-white/80">
                  Metrics include:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#33BECC]">•</span>
                    <span className="text-white/80">Engagement rate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#33BECC]">•</span>
                    <span className="text-white/80">Repeat interactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#33BECC]">•</span>
                    <span className="text-white/80">Location-based participation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#33BECC]">•</span>
                    <span className="text-white/80">Fan progression over the season</span>
                  </li>
                </ul>
              </div>

              <p className="text-xl text-white/80 leading-relaxed text-[#33BECC] font-semibold -mt-2">
                This isn&apos;t a one-off activation.<br />
                It&apos;s the foundation of a connected fan platform.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 7: WHY VONGA */}
        <section className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-[#0f0f0f]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Why Vonga
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
                  Purpose-built for sports and live events
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  No app downloads required
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  Scales globally
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  Privacy-first by design
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  Built to complement existing sponsorships and partnerships
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#33BECC] text-2xl font-bold mt-1">•</div>
                <p className="text-xl text-white/80 leading-relaxed">
                  Designed to turn fans into participants
                </p>
              </div>
            </motion.div>

            <motion.p
              className="text-2xl md:text-3xl leading-relaxed text-center my-12 text-[#33BECC] font-semibold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Vonga doesn&apos;t replace existing channels.<br />
              It connects them.
            </motion.p>
          </div>
        </section>

        {/* SECTION 8: FINAL CTA */}
        <section className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Let&apos;s Build the Future of F1 Fandom
              </h2>
              <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed">
                Cadillac F1 is entering the sport with a global audience already watching.
              </p>
              <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed">
                Vonga helps turn that audience into a connected community.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="bg-[#FF7F50] hover:bg-[#FF7F50]/90 text-white"
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

