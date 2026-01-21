"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

interface RiskReversalProps {
  headline: string;
  points: string[];
}

export function RiskReversal({ headline, points }: RiskReversalProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-24 md:py-32 bg-white"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-navy mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          {headline}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {points.map((point, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: 0.1 * index,
                ease: [0.25, 0.1, 0.25, 1.0] 
              }}
            >
              <Check className="w-6 h-6 text-aqua flex-shrink-0 mt-1" />
              <p className="text-gray-700 text-lg">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
