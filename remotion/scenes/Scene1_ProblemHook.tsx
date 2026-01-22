import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";

/**
 * Scene 1: Fan Wearing Jersey (0-3s)
 * Establishes context - fans in everyday scenario
 * Enhanced with dynamic camera movement and parallax
 */
export const Scene1_ProblemHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dramatic fade in with spring
  const imageOpacity = spring({
    frame,
    fps,
    config: { damping: 200, mass: 0.5 },
  });

  // Dynamic zoom with parallax effect
  const imageScale = interpolate(frame, [0, 90], [1.3, 1], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3), // Ease out cubic
  });

  // Pan movement (slow drift)
  const panX = interpolate(frame, [0, 90], [0, -30], {
    extrapolateRight: "clamp",
  });

  const panY = interpolate(frame, [0, 90], [0, 20], {
    extrapolateRight: "clamp",
  });

  // Rotate slightly for dynamic feel
  const rotate = interpolate(frame, [0, 90], [-1, 0], {
    extrapolateRight: "clamp",
  });

  // Animated gradient overlay
  const overlayOpacity = interpolate(frame, [0, 30, 60, 90], [0.8, 0.4, 0.2, 0.1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.brand.navy,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Fan Group Image with dynamic movement */}
      <Img
        src={staticFile("images/sections/Vonga - Group.png")}
        style={{
          width: "120%",
          height: "120%",
          objectFit: "cover",
          opacity: imageOpacity,
          transform: `scale(${imageScale}) translate(${panX}px, ${panY}px) rotate(${rotate}deg)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Animated gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, transparent 0%, ${theme.colors.brand.navy}${Math.round(overlayOpacity * 255).toString(16).padStart(2, '0')} 100%)`,
          opacity: overlayOpacity,
        }}
      />

      {/* Subtle vignette effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: `inset 0 0 200px ${theme.colors.brand.navy}80`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
