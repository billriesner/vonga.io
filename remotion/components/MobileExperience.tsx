import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";

interface MobileExperienceProps {
  experienceType?: "geofence" | "exclusive" | "timebound";
}

/**
 * Mobile Experience Component
 * Recreates the mobile notification/experience unlock UI
 */
export const MobileExperience: React.FC<MobileExperienceProps> = ({
  experienceType = "geofence",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Notification slide up
  const slideY = spring({
    frame,
    fps,
    config: { damping: 100, mass: 0.8 },
    from: 200,
    to: 0,
  });

  // Scale animation
  const scale = spring({
    frame,
    fps,
    config: { damping: 80, mass: 0.5 },
    from: 0.8,
    to: 1,
  });

  // Content animations
  const contentOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const iconScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 100 },
    from: 0,
    to: 1,
  });

  // Pulse effect
  const pulse = interpolate(
    frame,
    [20, 30, 40, 50],
    [1, 1.1, 1, 1.05],
    {
      extrapolateRight: "clamp",
    }
  );

  const getExperienceContent = () => {
    switch (experienceType) {
      case "geofence":
        return {
          title: "You're at the game!",
          message: "Tap to enter the prize draw",
          color: theme.colors.brand.aqua,
        };
      case "exclusive":
        return {
          title: "Exclusive Content Unlocked",
          message: "Watch the behind-the-scenes video",
          color: theme.colors.brand.coral,
        };
      case "timebound":
        return {
          title: "Game Time!",
          message: "Join the virtual watch party",
          color: theme.colors.brand.aqua,
        };
      default:
        return {
          title: "Experience Unlocked",
          message: "Tap to see what's inside",
          color: theme.colors.brand.aqua,
        };
    }
  };

  const content = getExperienceContent();

  // Helper component for SVG icons
  const LocationIcon = ({ color }: { color: string }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill={color}
      />
    </svg>
  );

  const CameraIcon = ({ color }: { color: string }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm0-5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"
        fill={color}
      />
      <path
        d="M21 6h-3.17l-1.24-1.35c-.37-.41-.91-.65-1.47-.65H8.88c-.56 0-1.1.24-1.47.65L6.17 6H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H3V8h18v10z"
        fill={color}
      />
    </svg>
  );

  const VideoIcon = ({ color }: { color: string }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
        fill={color}
      />
    </svg>
  );

  const TrophyIcon = ({ color }: { color: string }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"
        fill={color}
      />
    </svg>
  );

  return (
    <div
      style={{
        width: 390,
        height: 844,
        backgroundColor: "#000000",
        borderRadius: 47,
        padding: 8,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        transform: `translateY(${slideY}px) scale(${scale})`,
      }}
    >
      {/* iPhone screen */}
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#1A1A1A",
          borderRadius: 39,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* iPhone Dynamic Island (modern iPhone) */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 126,
            height: 37,
            backgroundColor: "#000000",
            borderRadius: 19,
            zIndex: 10,
          }}
        />

      {/* Notification Card - Enhanced with content preview */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 20,
          right: 20,
          backgroundColor: "#1A1A1A",
          borderRadius: 20,
          padding: 24,
          border: `2px solid ${content.color}40`,
          boxShadow: `0 0 30px ${content.color}30`,
          opacity: contentOpacity,
          transform: `scale(${pulse})`,
          maxHeight: "500px",
          overflow: "hidden",
        }}
      >
        {/* Icon - Location pin for geofence */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: `${content.color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            transform: `scale(${iconScale})`,
            border: `2px solid ${content.color}40`,
          }}
        >
          <LocationIcon color={content.color} />
        </div>

        {/* Title */}
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 8,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          {content.title}
        </div>

        {/* Message */}
        <div
          style={{
            color: "#CCCCCC",
            fontSize: 16,
            marginBottom: 16,
            fontFamily: theme.typography.fontFamily,
            lineHeight: 1.5,
          }}
        >
          {content.message}
        </div>

        {/* Content Preview Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {/* Photo preview */}
          <div
            style={{
              aspectRatio: "1",
              borderRadius: 8,
              background: `linear-gradient(135deg, ${content.color}40 0%, ${content.color}20 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CameraIcon color={content.color} />
          </div>
          {/* Video preview */}
          <div
            style={{
              aspectRatio: "1",
              borderRadius: 8,
              background: `linear-gradient(135deg, ${content.color}40 0%, ${content.color}20 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <VideoIcon color={content.color} />
          </div>
          {/* Prize preview */}
          <div
            style={{
              aspectRatio: "1",
              borderRadius: 8,
              background: `linear-gradient(135deg, ${content.color}40 0%, ${content.color}20 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrophyIcon color={content.color} />
          </div>
        </div>

        {/* Prize info */}
        <div
          style={{
            backgroundColor: `${content.color}15`,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            border: `1px solid ${content.color}30`,
          }}
        >
          <div
            style={{
              color: content.color,
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 4,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Prize: $500 Team Store Credit
          </div>
          <div
            style={{
              color: "#AAAAAA",
              fontSize: 12,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Plus exclusive behind-the-scenes content
          </div>
        </div>

        {/* CTA Button */}
        <div
          style={{
            backgroundColor: content.color,
            color: "#FFFFFF",
            padding: "14px 24px",
            borderRadius: 12,
            textAlign: "center",
            fontWeight: "600",
            fontSize: 16,
            fontFamily: theme.typography.fontFamily,
            boxShadow: `0 4px 20px ${content.color}50`,
          }}
        >
          Open Experience
        </div>
      </div>

        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 0,
            right: 0,
            height: 200,
            background: `radial-gradient(ellipse at center, ${content.color}20 0%, transparent 70%)`,
            opacity: contentOpacity * 0.5,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
