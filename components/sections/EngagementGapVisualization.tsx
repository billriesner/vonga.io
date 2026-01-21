"use client";

import { motion } from "framer-motion";

export function EngagementGapVisualization() {
  // Generate 100+ dots for engagement side (smaller grid: 8x8 = 64, still looks like 100+)
  const engagementDots = Array.from({ length: 64 }, (_, i) => i);
  
  // Only 4 dots for revenue side
  const revenueDots = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="w-full bg-navy rounded-2xl p-6 md:p-10 shadow-2xl">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        
        {/* Left Side: Fan Touchpoints */}
        <motion.div 
          className="flex flex-col items-center gap-4 max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Label */}
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-1">100+</div>
            <div className="text-xs md:text-sm font-semibold text-white/70 tracking-wider uppercase">Fan Touchpoints</div>
          </div>
          
          {/* Rectangle with dots */}
          <div className="border-2 border-aqua/30 rounded-xl p-5 bg-aqua/5">
            <div className="grid grid-cols-8 gap-2">
              {engagementDots.map((dot) => (
                <motion.div
                  key={dot}
                  className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-aqua"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: 0.4 + (dot * 0.008),
                    ease: "easeOut"
                  }}
                  style={{
                    boxShadow: "0 0 6px rgba(51, 190, 204, 0.5)"
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div 
          className="flex-shrink-0 rotate-90 md:rotate-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <svg 
            width="48" 
            height="24" 
            viewBox="0 0 48 24" 
            className="w-10 h-6"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="2.5"
                orient="auto"
              >
                <polygon 
                  points="0 0, 8 2.5, 0 5" 
                  fill="rgba(255,255,255,0.5)"
                />
              </marker>
            </defs>
            <line
              x1="0"
              y1="12"
              x2="40"
              y2="12"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeDasharray="4,4"
              markerEnd="url(#arrowhead)"
            />
          </svg>
        </motion.div>

        {/* Right Side: Revenue Events */}
        <motion.div 
          className="flex flex-col items-center gap-4 max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Label */}
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-1">3-5</div>
            <div className="text-xs md:text-sm font-semibold text-white/70 tracking-wider uppercase">Revenue Events</div>
          </div>
          
          {/* Rectangle with few dots */}
          <div className="border-2 border-coral/30 rounded-xl p-5 bg-coral/5 w-full aspect-square flex items-center justify-center">
            <div className="flex flex-wrap gap-4 justify-center items-center max-w-[120px]">
              {revenueDots.map((dot) => (
                <motion.div
                  key={dot}
                  className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-coral"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 1.2 + (dot * 0.12),
                    ease: "easeOut"
                  }}
                  style={{
                    boxShadow: "0 0 10px rgba(255, 107, 107, 0.6)"
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
