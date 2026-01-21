"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { X, Check } from "lucide-react";

interface Limitation {
  problem: string;
  solution: string;
}

interface DIYComparisonProps {
  headline: string;
  description: string;
  limitations: Limitation[];
  conclusion: string;
}

export function DIYComparison({
  headline,
  description,
  limitations,
  conclusion,
}: DIYComparisonProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-24 md:py-32 bg-gray-50"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
            {headline}
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="space-y-6 mb-12">
          {limitations.map((item, index) => (
            <motion.div
              key={index}
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: 0.1 * index,
                ease: [0.25, 0.1, 0.25, 1.0] 
              }}
            >
              {/* DIY Problem */}
              <div className="flex items-start gap-4 p-6 bg-white border-2 border-error/20 rounded-lg">
                <X className="w-6 h-6 text-error flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-900 font-medium mb-1">DIY Approach</p>
                  <p className="text-gray-600">{item.problem}</p>
                </div>
              </div>

              {/* Vonga Solution */}
              <div className="flex items-start gap-4 p-6 bg-white border-2 border-aqua/20 rounded-lg">
                <Check className="w-6 h-6 text-aqua flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-900 font-medium mb-1">Vonga</p>
                  <p className="text-gray-600">{item.solution}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Conclusion */}
        <motion.div
          className="bg-navy text-white p-8 md:p-12 rounded-lg text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: 0.6, 
            delay: 0.1 * limitations.length,
            ease: [0.25, 0.1, 0.25, 1.0] 
          }}
        >
          <p className="text-xl md:text-2xl leading-relaxed">
            {conclusion}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
