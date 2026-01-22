import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Video, staticFile, Img } from "remotion";
import { theme } from "../theme";

/**
 * Tap Interaction Component
 * Uses uploaded videos/images as base, enhanced with React animations
 */
export const TapInteraction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phone entrance animation
  const phoneTranslateX = spring({
    frame,
    fps,
    config: { damping: 100, mass: 0.8 },
    from: -200,
    to: 0,
  });

  const phoneTranslateY = spring({
    frame,
    fps,
    config: { damping: 120, mass: 0.8 },
    from: -100,
    to: 0,
  });

  const phoneRotate = interpolate(frame, [0, 30], [-15, 0], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Shirt position (static but could animate)
  const shirtScale = interpolate(frame, [0, 90], [0.9, 1.2], {
    extrapolateRight: "clamp",
  });

  // Tap point pulse effect
  const pulse1Scale = interpolate(frame, [30, 50, 70], [0, 3, 3.5], {
    extrapolateRight: "clamp",
  });
  const pulse1Opacity = interpolate(frame, [30, 50, 70], [0.8, 0.2, 0], {
    extrapolateRight: "clamp",
  });

  const pulse2Scale = interpolate(frame, [40, 60, 80], [0, 3, 3.5], {
    extrapolateRight: "clamp",
  });
  const pulse2Opacity = interpolate(frame, [40, 60, 80], [0.6, 0.15, 0], {
    extrapolateRight: "clamp",
  });

  // Flash effect when phone touches jersey
  const flashOpacity = interpolate(frame, [45, 48, 51], [0, 1, 0], {
    extrapolateRight: "clamp",
  });

  // Phone scale when approaching
  const phoneScale = interpolate(frame, [30, 50], [1, 0.95], {
    extrapolateRight: "clamp",
  });

  // Text animation - fade in and slide
  const textOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const textTranslateX = interpolate(frame, [0, 20], [30, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        padding: "0 80px",
      }}
    >
      {/* Left side: Video */}
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Video
          src={staticFile("videos/Vonga - Tap 2.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          startFrom={0}
          endAt={90}
        />
      </div>

      {/* Right side: Explanatory text */}
      <div
        style={{
          width: "45%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: "40px",
          opacity: textOpacity,
          transform: `translateX(${textTranslateX}px)`,
        }}
      >
        <h2
          style={{
            fontSize: 64,
            fontWeight: "700",
            color: theme.colors.brand.navy,
            fontFamily: theme.typography.fontFamily,
            margin: 0,
            marginBottom: 32,
            lineHeight: 1.2,
          }}
        >
          Tap your smartphone to the team shirt
        </h2>
        <p
          style={{
            fontSize: 28,
            fontWeight: "400",
            color: theme.colors.brand.navy,
            fontFamily: theme.typography.fontFamily,
            margin: 0,
            lineHeight: 1.6,
            opacity: 0.8,
          }}
        >
          Instantly unlock exclusive experiences, content, and rewards with a simple tap.
        </p>
      </div>
    </div>
  );
};
