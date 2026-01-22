import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { DashboardCreation } from "../components/DashboardCreation";

/**
 * Scene 5: Creating Experiences (15-20s)
 * Shows animated dashboard creation component
 */
export const Scene5_RevenueGrowth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Container animations
  const containerScale = spring({
    frame,
    fps,
    config: { damping: 100, mass: 0.7 },
    from: 0.85,
    to: 1,
  });

  // Focus zoom
  const zoom = interpolate(frame, [0, 80, 150], [1, 1.08, 1.03], {
    extrapolateRight: "clamp",
    easing: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  });

  // Subtle pan
  const panY = interpolate(frame, [0, 150], [0, -20], {
    extrapolateRight: "clamp",
  });


  // Text animation for bottom text
  const bottomTextOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const bottomTextTranslateY = interpolate(frame, [0, 30], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.gray[50],
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "0 80px",
      }}
    >
      {/* Dashboard Creation Component - centered */}
      <div
        style={{
          width: "100%",
          height: "85%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${containerScale * zoom}) translateY(${panY}px)`,
            position: "relative",
          }}
        >
          <DashboardCreation />
        </div>
      </div>

      {/* Bottom text - single line */}
      <div
        style={{
          width: "100%",
          height: "15%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 20,
          paddingLeft: 80,
          paddingRight: 80,
          opacity: bottomTextOpacity,
          transform: `translateY(${bottomTextTranslateY}px)`,
        }}
      >
        <h2
          style={{
            fontSize: 48,
            fontWeight: "700",
            color: theme.colors.brand.navy,
            fontFamily: theme.typography.fontFamily,
            margin: 0,
            lineHeight: 1.2,
            textAlign: "center",
          }}
        >
          Create experiences in minutes
        </h2>
      </div>
    </AbsoluteFill>
  );
};
