import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { MobileExperience } from "../components/MobileExperience";

/**
 * Scene 2: Experience Unlocks (3-7s)
 * Shows what the fan sees - animated mobile experience component
 */
export const Scene3_EngagementDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Container animations
  const containerScale = spring({
    frame,
    fps,
    config: { damping: 80, mass: 0.5 },
    from: 0.8,
    to: 1,
  });

  const containerRotate = interpolate(frame, [0, 30], [5, 0], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });


  // Glow effect
  const glowIntensity = interpolate(
    frame,
    [20, 40, 60, 80, 100, 120],
    [0, 0.8, 0.4, 0.8, 0.4, 0.6],
    {
      extrapolateRight: "clamp",
    }
  );

  // Text animation - fade in and slide (from left)
  const textOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const textTranslateX = interpolate(frame, [0, 30], [-30, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.brand.navy,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        padding: "0 80px",
      }}
    >
      {/* Left side: Explanatory text */}
      <div
        style={{
          width: "45%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingRight: "40px",
          opacity: textOpacity,
          transform: `translateX(${-textTranslateX}px)`,
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            fontSize: 64,
            fontWeight: "700",
            color: "#FFFFFF",
            fontFamily: theme.typography.fontFamily,
            margin: 0,
            marginBottom: 32,
            lineHeight: 1.2,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          Instantly unlock exclusive experiences, content, and prizes
        </h2>
        <p
          style={{
            fontSize: 28,
            fontWeight: "400",
            color: "#FFFFFF",
            fontFamily: theme.typography.fontFamily,
            margin: 0,
            lineHeight: 1.6,
            opacity: 0.9,
          }}
        >
          Fans get immediate access to photos, videos, prizes, and exclusive content the moment they tap.
        </p>
      </div>

      {/* Right side: Mobile Experience Component */}
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            transform: `scale(${containerScale * 1.1}) rotate(${containerRotate}deg)`,
            position: "relative",
          }}
        >
          <MobileExperience experienceType="geofence" />

          {/* Pulsing aqua glow around phone */}
          <div
            style={{
              position: "absolute",
              inset: -30,
              borderRadius: 40,
              boxShadow: `0 0 ${60 + glowIntensity * 40}px ${theme.colors.brand.aqua}${Math.round(glowIntensity * 255).toString(16).padStart(2, '0')}`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
