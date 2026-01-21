"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Lock, ShoppingBag, TrendingUp, LucideIcon } from "lucide-react";
import type { ExperienceType } from "@/content/experience-types";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  MapPin,
  Clock,
  Lock,
  ShoppingBag,
  TrendingUp,
};

interface ExperienceTypesProps {
  headline?: string;
  subhead?: string;
  experiences: ExperienceType[];
}

export function ExperienceTypes({
  headline = "Turn Apparel Into the Gateway to Fan Experiences",
  subhead = "Transform one-time purchases into an ongoing channel. Create unique, fan-centric experiences where your apparel becomes the access point.",
  experiences,
}: ExperienceTypesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-24 md:py-32 bg-gray-50"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-navy mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            {headline}
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-700 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            {subhead}
          </motion.p>
        </div>

        {/* Experience Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {experiences.map((experience, index) => {
            const Icon = iconMap[experience.icon] || MapPin;
            
            return (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.1 * index,
                  ease: [0.25, 0.1, 0.25, 1.0] 
                }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-aqua/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-aqua" />
                    </div>
                    <CardTitle className="text-xl">{experience.title}</CardTitle>
                    <CardDescription className="text-base">
                      {experience.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      <span className="font-semibold text-gray-700">Examples: </span>
                      {experience.examples}
                    </p>
                    <p className="text-sm text-aqua font-medium">
                      {experience.benefit}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Zero-Party Data Advantage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white border-2 border-navy/10 rounded-2xl p-8 md:p-10 text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-navy/5 rounded-full">
              <span className="text-navy font-semibold text-sm uppercase tracking-wide">The Data Advantage</span>
            </div>
            
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
              Track all fan activity on one platform. No need to string together social media, ticket sales, and retail data from disparate sources.
            </p>
            
            <p className="text-2xl font-semibold text-navy">
              Zero-party data. Complete visibility.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
