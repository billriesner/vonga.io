"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play } from "lucide-react";

interface VideoDemoProps {
  headline?: string;
  description?: string;
  videoUrl?: string;
  placeholderText?: string;
  thumbnailImage?: string;
  caption?: string;
}

export function VideoDemo({
  headline = "See It In Action",
  description,
  videoUrl,
  placeholderText = "Demo video coming soon",
  thumbnailImage,
  caption,
}: VideoDemoProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section 
      ref={ref}
      id="video"
      className="py-24 md:py-32 bg-gray-50"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
            {headline}
          </h2>
          {description && (
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="relative aspect-video rounded-lg overflow-hidden shadow-2xl"
        >
          {videoUrl ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster={thumbnailImage}
                controls={isPlaying}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {!isPlaying && (
                <button
                  onClick={handlePlayClick}
                  className="absolute inset-0 flex items-center justify-center bg-navy/30 hover:bg-navy/40 transition-colors group"
                >
                  <div className="w-20 h-20 rounded-full bg-aqua flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </div>
                </button>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-full bg-gray-400 flex items-center justify-center mx-auto mb-6">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
                <p className="text-xl text-gray-600 font-medium">
                  {placeholderText}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {caption && (
          <motion.p
            className="text-center text-sm text-gray-600 mt-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {caption}
          </motion.p>
        )}
      </div>
    </section>
  );
}
