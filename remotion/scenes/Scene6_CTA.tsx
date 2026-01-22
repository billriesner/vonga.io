import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";
import { theme } from "../theme";

/**
 * Scene 5: Vonga Logo End Cap (17-27s)
 * Beautiful end cap with Vonga logo
 */
export const Scene6_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance - faster
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 100, mass: 0.8 },
    from: 0.5,
    to: 1,
  });

  const logoOpacity = spring({
    frame,
    fps,
    config: { damping: 100 },
    from: 0,
    to: 1,
  });

  // Logo rotation (subtle)
  const logoRotate = interpolate(frame, [0, 30], [-5, 0], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Tagline appears - faster
  const taglineOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineTranslateY = spring({
    frame: frame - 40,
    fps,
    config: { damping: 100 },
    from: 20,
    to: 0,
  });

  // URL appears - faster
  const urlOpacity = interpolate(frame, [80, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.brand.navy,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: theme.typography.fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Vonga Logo - Aqua colored, larger */}
      <div
        style={{
          transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
          opacity: logoOpacity,
          position: "relative",
        }}
      >
        <div
          style={{
            width: 600,
            height: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: "drop-shadow(0 0 40px rgba(51, 190, 204, 0.4))",
          }}
        >
          <Img
            src={staticFile("images/logos/logo.svg")}
            style={{
              width: "100%",
              height: "auto",
              filter: `brightness(0) saturate(100%) invert(67%) sepia(67%) saturate(1000%) hue-rotate(150deg) brightness(0.95) contrast(1.1)`,
            }}
          />
        </div>
      </div>

      {/* Tagline - larger and more prominent */}
      <div
        style={{
          marginTop: 60,
          opacity: taglineOpacity,
          transform: `translateY(${taglineTranslateY}px)`,
          color: "#FFFFFF",
          fontSize: 56,
          fontWeight: "700",
          textAlign: "center",
          textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          letterSpacing: "-0.02em",
        }}
      >
        Create experiences that matter
      </div>

      {/* URL - larger */}
      <div
        style={{
          marginTop: 32,
          opacity: urlOpacity,
          color: theme.colors.brand.aqua,
          fontSize: 36,
          fontWeight: "700",
          textAlign: "center",
          letterSpacing: "0.15em",
          textShadow: `0 0 20px ${theme.colors.brand.aqua}40`,
        }}
      >
        vonga.io
      </div>
    </AbsoluteFill>
  );
};
