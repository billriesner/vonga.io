import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";

/**
 * Dashboard Creation Component
 * Shows the experience creation interface
 */
export const DashboardCreation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Form field animations
  const field1Opacity = spring({
    frame: frame - 10,
    fps,
    config: { damping: 100 },
    from: 0,
    to: 1,
  });

  const field2Opacity = spring({
    frame: frame - 25,
    fps,
    config: { damping: 100 },
    from: 0,
    to: 1,
  });

  const field3Opacity = spring({
    frame: frame - 40,
    fps,
    config: { damping: 100 },
    from: 0,
    to: 1,
  });

  // Media upload section animation
  const mediaOpacity = spring({
    frame: frame - 55,
    fps,
    config: { damping: 100 },
    from: 0,
    to: 1,
  });

  // Button animation
  const buttonScale = spring({
    frame: frame - 70,
    fps,
    config: { damping: 80, mass: 0.5 },
    from: 0.8,
    to: 1,
  });

  // Cursor position (simulates typing/clicking)
  const cursorOpacity = interpolate(frame, [50, 55, 60, 65], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 1400,
        height: 900,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 32,
        fontFamily: theme.typography.fontFamily,
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 20,
          borderBottom: `2px solid ${theme.colors.gray[200]}`,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: theme.colors.brand.navy,
              marginBottom: 4,
            }}
          >
            Create New Experience
          </div>
          <div style={{ fontSize: 16, color: theme.colors.gray[600] }}>
            Set up a new fan engagement experience
          </div>
        </div>
        <div
          style={{
            padding: "8px 16px",
            backgroundColor: theme.colors.gray[100],
            borderRadius: 8,
            color: theme.colors.gray[700],
            fontSize: 14,
          }}
        >
          Draft
        </div>
      </div>

      {/* Form Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
        {/* Field 1: Experience Name */}
        <div
          style={{
            opacity: field1Opacity,
            transform: `translateY(${(1 - field1Opacity) * 20}px)`,
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: "600",
              color: theme.colors.brand.navy,
              marginBottom: 8,
            }}
          >
            Experience Name
          </label>
          <input
            type="text"
            value="Game Day Prize Draw"
            readOnly
            style={{
              width: "100%",
              padding: "12px 16px",
              border: `2px solid ${theme.colors.gray[300]}`,
              borderRadius: 8,
              fontSize: 16,
              fontFamily: theme.typography.fontFamily,
              backgroundColor: "#FFFFFF",
            }}
          />
          {frame > 50 && frame < 65 && (
            <div
              style={{
                position: "absolute",
                marginTop: -28,
                marginLeft: 200,
                width: 2,
                height: 20,
                backgroundColor: theme.colors.brand.aqua,
                opacity: cursorOpacity,
              }}
            />
          )}
        </div>

        {/* Field 2: Experience Type */}
        <div
          style={{
            opacity: field2Opacity,
            transform: `translateY(${(1 - field2Opacity) * 20}px)`,
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: "600",
              color: theme.colors.brand.navy,
              marginBottom: 8,
            }}
          >
            Experience Type
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {["Geofenced", "Timebound", "Exclusive"].map((type, i) => (
              <div
                key={type}
                style={{
                  padding: "16px",
                  border: `2px solid ${
                    i === 0 ? theme.colors.brand.aqua : theme.colors.gray[300]
                  }`,
                  borderRadius: 8,
                  backgroundColor:
                    i === 0
                      ? `${theme.colors.brand.aqua}10`
                      : "#FFFFFF",
                  textAlign: "center",
                  fontWeight: i === 0 ? "600" : "400",
                  color:
                    i === 0
                      ? theme.colors.brand.aqua
                      : theme.colors.gray[700],
                }}
              >
                {type}
              </div>
            ))}
          </div>
        </div>

        {/* Field 3: Geofence Settings */}
        <div
          style={{
            opacity: field3Opacity,
            transform: `translateY(${(1 - field3Opacity) * 20}px)`,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: "600",
                color: theme.colors.brand.navy,
                marginBottom: 8,
              }}
            >
              Location
            </label>
            <div
              style={{
                padding: "12px 16px",
                border: `2px solid ${theme.colors.gray[300]}`,
                borderRadius: 8,
                backgroundColor: theme.colors.gray[50],
                fontSize: 16,
                color: theme.colors.gray[700],
              }}
            >
              Stadium - Main Entrance
            </div>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: "600",
                color: theme.colors.brand.navy,
                marginBottom: 8,
              }}
            >
              Radius
            </label>
            <div
              style={{
                padding: "12px 16px",
                border: `2px solid ${theme.colors.gray[300]}`,
                borderRadius: 8,
                backgroundColor: theme.colors.gray[50],
                fontSize: 16,
                color: theme.colors.gray[700],
              }}
            >
              100 meters
            </div>
          </div>
        </div>

        {/* Media Upload Section */}
        <div
          style={{
            opacity: mediaOpacity,
            transform: `translateY(${(1 - mediaOpacity) * 20}px)`,
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: "600",
              color: theme.colors.brand.navy,
              marginBottom: 8,
            }}
          >
            Add Media
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {/* Image upload placeholder */}
            <div
              style={{
                aspectRatio: "1",
                border: `2px dashed ${theme.colors.gray[300]}`,
                borderRadius: 8,
                backgroundColor: theme.colors.gray[50],
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 6h-3.17l-1.24-1.35c-.37-.41-.91-.65-1.47-.65H8.88c-.56 0-1.1.24-1.47.65L6.17 6H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H3V8h18v10z"
                  fill={theme.colors.gray[400]}
                />
                <path
                  d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm0-5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"
                  fill={theme.colors.gray[400]}
                />
              </svg>
              <span style={{ fontSize: 12, color: theme.colors.gray[600] }}>Image</span>
            </div>

            {/* Video upload placeholder */}
            <div
              style={{
                aspectRatio: "1",
                border: `2px dashed ${theme.colors.gray[300]}`,
                borderRadius: 8,
                backgroundColor: theme.colors.gray[50],
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
                  fill={theme.colors.gray[400]}
                />
              </svg>
              <span style={{ fontSize: 12, color: theme.colors.gray[600] }}>Video</span>
            </div>

            {/* Preview of uploaded image */}
            <div
              style={{
                aspectRatio: "1",
                border: `2px solid ${theme.colors.brand.aqua}`,
                borderRadius: 8,
                backgroundColor: `${theme.colors.brand.aqua}10`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "80%",
                  height: "80%",
                  backgroundColor: theme.colors.brand.aqua,
                  borderRadius: 4,
                  opacity: 0.3,
                }}
              />
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                }}
              >
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  fill={theme.colors.brand.aqua}
                />
              </svg>
            </div>

            {/* Preview of uploaded video */}
            <div
              style={{
                aspectRatio: "1",
                border: `2px solid ${theme.colors.brand.aqua}`,
                borderRadius: 8,
                backgroundColor: `${theme.colors.brand.aqua}10`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "80%",
                  height: "80%",
                  backgroundColor: theme.colors.brand.aqua,
                  borderRadius: 4,
                  opacity: 0.3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 5v14l11-7z"
                    fill="#FFFFFF"
                  />
                </svg>
              </div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                }}
              >
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  fill={theme.colors.brand.aqua}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          paddingTop: 20,
          borderTop: `2px solid ${theme.colors.gray[200]}`,
        }}
      >
        <button
          style={{
            padding: "12px 24px",
            border: `2px solid ${theme.colors.gray[300]}`,
            borderRadius: 8,
            backgroundColor: "#FFFFFF",
            color: theme.colors.gray[700],
            fontSize: 16,
            fontWeight: "600",
            fontFamily: theme.typography.fontFamily,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          style={{
            padding: "12px 24px",
            border: "none",
            borderRadius: 8,
            backgroundColor: theme.colors.brand.aqua,
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "600",
            fontFamily: theme.typography.fontFamily,
            cursor: "pointer",
            transform: `scale(${buttonScale})`,
            boxShadow: `0 4px 20px ${theme.colors.brand.aqua}40`,
          }}
        >
          Create Experience
        </button>
      </div>
    </div>
  );
};
