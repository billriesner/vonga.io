import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";

interface NarrativeTextProps {
  text: string;
  delay?: number;
  position?: "top" | "bottom";
  color?: string;
}

/**
 * Narrative Text Component
 * Guides audience through each scene
 * Positioned below or above content (not on top)
 */
export const NarrativeText: React.FC<NarrativeTextProps> = ({
  text,
  delay = 0,
  position = "bottom",
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text animation
  const textOpacity = spring({
    frame: frame - delay,
    fps,
    config: { damping: 100 },
    from: 0,
    to: 1,
  });

  const textTranslateY = spring({
    frame: frame - delay,
    fps,
    config: { damping: 100 },
    from: position === "bottom" ? 20 : -20,
    to: 0,
  });

  const positionStyle = position === "bottom" 
    ? { bottom: "8%" }
    : { top: "8%" };

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyle,
        left: "50%",
        transform: `translateX(-50%) translateY(${textTranslateY}px)`,
        opacity: textOpacity,
        color: color || theme.colors.brand.navy,
        fontSize: 28,
        fontWeight: "600",
        textAlign: "center",
        maxWidth: 1000,
        padding: "0 40px",
        fontFamily: theme.typography.fontFamily,
        textShadow: color === "#FFFFFF" 
          ? "0 2px 8px rgba(0,0,0,0.5)" 
          : "0 2px 8px rgba(255,255,255,0.8)",
        zIndex: 100,
      }}
    >
      {text}
    </div>
  );
};
