'use client';

import { motion } from 'framer-motion';
import { Pencil, Rocket, Target, TrendingUp, LucideIcon } from 'lucide-react';

interface JourneyStep {
  number: number;
  icon: LucideIcon;
  label: string;
  detail: string;
}

const steps: JourneyStep[] = [
  {
    number: 1,
    icon: Pencil,
    label: 'Design',
    detail: 'Co-create together'
  },
  {
    number: 2,
    icon: Rocket,
    label: 'Launch',
    detail: '6-8 weeks'
  },
  {
    number: 3,
    icon: Target,
    label: 'Pilot',
    detail: 'Start with 300 kits'
  },
  {
    number: 4,
    icon: TrendingUp,
    label: 'Optimize',
    detail: 'Data-driven growth'
  }
];

export default function PartnershipJourney() {
  return (
    <div className="flex flex-col items-center gap-0 w-full max-w-sm mx-auto">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.number} className="flex flex-col items-center w-full">
            {/* Step Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.15,
                ease: 'easeOut'
              }}
              className="relative w-full bg-white rounded-xl border-2 border-navy/10 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Number Badge */}
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-aqua flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">{step.number}</span>
              </div>
              
              {/* Content */}
              <div className="flex items-start gap-4 ml-2">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-navy" strokeWidth={2} />
                </div>
                
                {/* Text */}
                <div className="flex-1 pt-1">
                  <h4 className="font-semibold text-lg text-navy mb-1">
                    {step.label}
                  </h4>
                  <p className="text-sm text-navy/70">
                    {step.detail}
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Connector Line */}
            {!isLast && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                whileInView={{ opacity: 1, scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.15 + 0.3,
                  ease: 'easeOut'
                }}
                className="w-0.5 h-8 bg-gradient-to-b from-aqua/40 via-aqua/20 to-aqua/40 my-2"
                style={{ originY: 0 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
