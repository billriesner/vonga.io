"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import PartnershipJourney from "./PartnershipJourney";

interface PartnershipProps {
  headline: string;
  subhead?: string;
  points: string[];
  image?: string;
}

export function Partnership({
  headline,
  subhead,
  points,
  image,
}: PartnershipProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-24 md:py-32 bg-gray-50"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
              {headline}
            </h2>
            {subhead && (
              <p className="text-lg text-gray-700 mb-8">
                {subhead}
              </p>
            )}
            <ul className="space-y-4">
              {points.map((point, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.2 + (index * 0.1),
                    ease: [0.25, 0.1, 0.25, 1.0] 
                  }}
                >
                  <Check className="w-6 h-6 text-aqua flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-lg">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Journey Visual */}
          <div className="flex items-center justify-center">
            <PartnershipJourney />
          </div>
        </div>
      </div>
    </section>
  );
}
