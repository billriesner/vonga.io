"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface CategoryDefinitionProps {
  categoryName: string;
  translation: string;
  explanation: string;
  proofMechanism: string;
  context?: string;
}

export function CategoryDefinition({
  categoryName,
  translation,
  explanation,
  proofMechanism,
  context,
}: CategoryDefinitionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-24 md:py-32 bg-white"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-6 px-4 py-2 bg-aqua/10 rounded-full">
            <span className="text-aqua font-semibold">{categoryName}</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-8">
            {translation}
          </h2>

          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            {explanation}
          </p>
        </motion.div>

        {/* Stats Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="bg-gradient-to-br from-aqua/10 to-aqua/5 border-2 border-aqua/20 rounded-2xl p-8 md:p-10 mb-12"
        >
          {/* Large Numbers */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <motion.div 
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-6xl md:text-7xl font-bold text-aqua mb-2">
                2.8×
              </div>
              <div className="text-lg md:text-xl font-semibold text-navy mb-1">
                Shopping Frequency
              </div>
              <div className="text-sm text-gray-600">
                More often than average
              </div>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="text-6xl md:text-7xl font-bold text-aqua mb-2">
                4.3×
              </div>
              <div className="text-lg md:text-xl font-semibold text-navy mb-1">
                Total Spending
              </div>
              <div className="text-sm text-gray-600">
                More than average
              </div>
            </motion.div>
          </div>

          {/* Proof Statement */}
          <div className="border-t border-aqua/20 pt-6">
            <p className="text-center text-lg md:text-xl text-gray-700 leading-relaxed">
              {proofMechanism}
            </p>
          </div>
        </motion.div>

        {/* Context */}
        {context && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {context}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
