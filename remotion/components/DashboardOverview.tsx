import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";

/**
 * Dashboard Overview Component
 * Recreates the team dashboard with animated metrics
 */
export const DashboardOverview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Metric animations (staggered)
  const metric1Progress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 100 },
    from: 0,
    to: 1,
  });

  const metric2Progress = spring({
    frame: frame - 35,
    fps,
    config: { damping: 100 },
    from: 0,
    to: 1,
  });

  const metric3Progress = spring({
    frame: frame - 50,
    fps,
    config: { damping: 100 },
    from: 0,
    to: 1,
  });

  const metric4Progress = spring({
    frame: frame - 65,
    fps,
    config: { damping: 100 },
    from: 0,
    to: 1,
  });

  // Chart animation
  const chartProgress = interpolate(frame, [80, 120], [0, 1], {
    extrapolateRight: "clamp",
    easing: (t) => t * (2 - t),
  });

  // Map dots animation
  const mapDotsOpacity = interpolate(frame, [100, 130], [0, 1], {
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
            Engagement Dashboard
          </div>
          <div style={{ fontSize: 16, color: theme.colors.gray[600] }}>
            Real-time fan engagement and revenue data
          </div>
        </div>
        <div
          style={{
            padding: "8px 16px",
            backgroundColor: `${theme.colors.brand.aqua}10`,
            borderRadius: 8,
            color: theme.colors.brand.aqua,
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          Live
        </div>
      </div>

      {/* Metrics Grid - 3 metrics now */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {/* Metric 1: Active Wearers */}
        <MetricCard
          label="Active Wearers"
          value={2847}
          change="+12%"
          color={theme.colors.brand.aqua}
          progress={metric1Progress}
        />

        {/* Metric 2: Engagements Today */}
        <MetricCard
          label="Engagements Today"
          value={1234}
          change="+8%"
          color={theme.colors.brand.aqua}
          progress={metric2Progress}
        />

        {/* Metric 3: Avg. Engagement Rate */}
        <MetricCard
          label="Avg. Engagement Rate"
          value={68}
          suffix="%"
          change="+5%"
          color={theme.colors.brand.aqua}
          progress={metric4Progress}
        />
      </div>

      {/* Map and Chart Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          flex: 1,
        }}
      >
        {/* Fans by City Graph */}
        <div
          style={{
            backgroundColor: theme.colors.gray[50],
            borderRadius: 12,
            padding: 24,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: theme.colors.brand.navy,
              marginBottom: 16,
            }}
          >
            Fans by City
          </div>
          {/* Bar Chart */}
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: 8,
              paddingTop: 20,
            }}
          >
            {[
              { city: "NYC", fans: 450 },
              { city: "LA", fans: 380 },
              { city: "CHI", fans: 320 },
              { city: "DAL", fans: 280 },
              { city: "ATL", fans: 240 },
              { city: "DEN", fans: 200 },
            ].map((data, i) => {
              const barProgress = spring({
                frame: frame - (100 + i * 8),
                fps,
                config: { damping: 100 },
                from: 0,
                to: 1,
              });

              return (
                <div
                  key={data.city}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    height: "14%",
                  }}
                >
                  {/* City label */}
                  <div
                    style={{
                      width: 50,
                      fontSize: 14,
                      fontWeight: "600",
                      color: theme.colors.brand.navy,
                      textAlign: "right",
                    }}
                  >
                    {data.city}
                  </div>
                  {/* Bar */}
                  <div
                    style={{
                      flex: 1,
                      height: "60%",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: `${data.fans / 5 * barProgress}%`,
                        height: "100%",
                        backgroundColor: theme.colors.brand.aqua,
                        borderRadius: "4px 0 0 4px",
                        boxShadow: `0 2px 8px ${theme.colors.brand.aqua}40`,
                        transition: "width 0.3s ease-out",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingRight: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: "#FFFFFF",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {Math.round(data.fans * barProgress)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart View */}
        <div
          style={{
            backgroundColor: theme.colors.gray[50],
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: theme.colors.brand.navy,
              marginBottom: 16,
            }}
          >
            Engagement Trend
          </div>
          {/* Simple bar chart */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 12,
              height: "100%",
              paddingTop: 20,
            }}
          >
            {[65, 72, 68, 75, 82, 78, 85].map((height, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.brand.aqua,
                  height: `${height * chartProgress}%`,
                  borderRadius: "4px 4px 0 0",
                  opacity: 0.8 + (i * 0.03),
                  transition: "height 0.3s ease-out",
                  boxShadow: `0 -2px 8px ${theme.colors.brand.aqua}40`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
  suffix?: string;
  change: string;
  color: string;
  progress: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  isCurrency = false,
  suffix = "",
  change,
  color,
  progress,
}) => {
  const displayValue = isCurrency
    ? `$${(value * progress).toLocaleString()}`
    : `${Math.round(value * progress).toLocaleString()}${suffix}`;

  return (
    <div
      style={{
        backgroundColor: theme.colors.gray[50],
        borderRadius: 12,
        padding: 20,
        border: `2px solid ${color}20`,
      }}
    >
      <div
        style={{
          fontSize: 14,
          color: theme.colors.gray[600],
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: "bold",
          color: color,
          marginBottom: 8,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {displayValue}
      </div>
      <div
        style={{
          fontSize: 12,
          color: theme.colors.gray[600],
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span style={{ color: theme.colors.brand.aqua }}>▲</span>
        {change} from last week
      </div>
    </div>
  );
};
