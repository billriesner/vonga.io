"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Shield, Smartphone, XCircle, CheckCircle2, 
  Lock, Settings, Globe, LucideIcon 
} from "lucide-react";
import type { TrustStatement } from "@/content/trust-statements";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Shield,
  Smartphone,
  XCircle,
  CheckCircle2,
  Lock,
  Settings,
  Globe,
};

interface TrustSectionProps {
  headline?: string;
  statements: TrustStatement[];
}

export function TrustSection({
  headline = "Built on Trust",
  statements,
}: TrustSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-24 md:py-32 bg-white"
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {statements.map((statement, index) => {
            const Icon = iconMap[statement.icon] || CheckCircle2;
            const isLastItem = index === statements.length - 1;
            
            return (
              <motion.div
                key={statement.id}
                className={`flex flex-col items-center text-center p-6 ${
                  isLastItem ? 'sm:col-span-2 sm:mx-auto sm:max-w-sm lg:col-span-1 lg:col-start-2' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.1 * index,
                  ease: [0.25, 0.1, 0.25, 1.0] 
                }}
              >
                <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  {statement.text}
                </h3>
                <p className="text-sm text-gray-600">
                  {statement.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
