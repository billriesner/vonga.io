import React from "react";
import { AbsoluteFill } from "remotion";
import { TapInteraction } from "../components/TapInteraction";
import { NarrativeText } from "../components/NarrativeText";

/**
 * Scene 1: The Tap (0-3s)
 * Shows the interaction mechanism - smartphone tapping shirt
 * Now using animated React component
 */
export const Scene2_AppearanceTransition: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <TapInteraction />
    </AbsoluteFill>
  );
};
