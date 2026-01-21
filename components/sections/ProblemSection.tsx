"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { EngagementGapVisualization } from "./EngagementGapVisualization";

interface ProblemSectionProps {
  headline: string;
  description: string;
  statement: string;
  image?: string;
}

export function ProblemSection({
  headline,
  description,
  statement,
  image,
}: ProblemSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-24 md:py-32 bg-white"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
              {headline}
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {description}
            </p>
            <p className="text-2xl font-semibold text-aqua">
              {statement}
            </p>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <EngagementGapVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
