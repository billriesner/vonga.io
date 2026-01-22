import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { DashboardOverview } from "../components/DashboardOverview";

/**
 * Scene 4: Dashboard Overview (10-15s)
 * Shows animated dashboard component - team control and visibility
 */
export const Scene4_ExperienceTypes: React.FC = () => {
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

  // Camera pan
  const panX = interpolate(frame, [0, 150], [-30, 30], {
    extrapolateRight: "clamp",
    easing: (t) => t * (2 - t),
  });

  // Subtle zoom
  const zoom = interpolate(frame, [0, 150], [1, 1.05], {
    extrapolateRight: "clamp",
  });


  // Text animation - fade in and slide
  const textOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const textTranslateX = interpolate(frame, [0, 30], [30, 0], { extrapolateRight: "clamp" });

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
      {/* Dashboard Component - centered */}
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
            transform: `scale(${containerScale * zoom}) translateX(${panX}px)`,
            position: "relative",
          }}
        >
          <DashboardOverview />
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
          Track every fan interaction in real-time
        </h2>
      </div>
    </AbsoluteFill>
  );
};
