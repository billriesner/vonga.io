"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X, Check } from "lucide-react";

interface ContrastTableProps {
  headline?: string;
  leftColumn: {
    title: string;
    items: string[];
  };
  rightColumn: {
    title: string;
    items: string[];
  };
}

export function ContrastTable({
  headline = "Clothes vs Connection",
  leftColumn,
  rightColumn,
}: ContrastTableProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-24 md:py-32 bg-gray-50"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-navy mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          {headline}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Everyone Else */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <Card className="h-full bg-gray-100 border-gray-300">
              <CardHeader>
                <CardTitle className="text-gray-700">{leftColumn.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {leftColumn.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Vonga */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <Card className="h-full border-aqua border-2 bg-white shadow-glow">
              <CardHeader>
                <CardTitle className="text-navy">{rightColumn.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {rightColumn.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-aqua flex-shrink-0 mt-0.5" />
                      <span className="text-gray-900 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
