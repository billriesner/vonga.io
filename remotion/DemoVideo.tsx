import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene2_AppearanceTransition } from "./scenes/Scene2_AppearanceTransition";
import { Scene3_EngagementDashboard } from "./scenes/Scene3_EngagementDashboard";
import { Scene4_ExperienceTypes } from "./scenes/Scene4_ExperienceTypes";
import { Scene5_RevenueGrowth } from "./scenes/Scene5_RevenueGrowth";
import { Scene6_CTA } from "./scenes/Scene6_CTA";

/**
 * Demo Video - Pure Product Demo (22 seconds)
 * 
 * Structure:
 * - PART 1: Fan Experience (0-7s)
 *   - Scene 1: The tap (0-3s)
 *   - Scene 2: Experience unlocks (3-7s)
 * 
 * - PART 2: Team Control (7-17s)
 *   - Scene 3: Creating experiences (7-12s)
 *   - Scene 4: Dashboard overview (12-17s)
 * 
 * - PART 3: End Cap (17-22s)
 *   - Scene 5: Logo and CTA (17-22s)
 */
export const DemoVideo: React.FC = () => {
  // Scene timings (30fps = 30 frames per second)
  const scenes = {
    scene1: { start: 0, duration: 90 }, // 3 seconds - The tap
    scene2: { start: 90, duration: 120 }, // 4 seconds - Experience unlocks
    scene3: { start: 210, duration: 150 }, // 5 seconds - Dashboard overview
    scene4: { start: 360, duration: 150 }, // 5 seconds - Creating experiences
    scene5: { start: 510, duration: 150 }, // 5 seconds - End cap
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF" }}>
      {/* PART 1: Fan Experience */}
      {/* Scene 1: The tap */}
      <Sequence from={scenes.scene1.start} durationInFrames={scenes.scene1.duration}>
        <Scene2_AppearanceTransition />
      </Sequence>

      {/* Scene 2: Experience unlocks */}
      <Sequence from={scenes.scene2.start} durationInFrames={scenes.scene2.duration}>
        <Scene3_EngagementDashboard />
      </Sequence>

      {/* PART 2: Team Control */}
      {/* Scene 3: Creating experiences */}
      <Sequence from={scenes.scene3.start} durationInFrames={scenes.scene3.duration}>
        <Scene5_RevenueGrowth />
      </Sequence>

      {/* Scene 4: Dashboard overview */}
      <Sequence from={scenes.scene4.start} durationInFrames={scenes.scene4.duration}>
        <Scene4_ExperienceTypes />
      </Sequence>

      {/* PART 3: Bridge */}
      {/* Scene 5: Bridge to Experience Types */}
      <Sequence from={scenes.scene5.start} durationInFrames={scenes.scene5.duration}>
        <Scene6_CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
