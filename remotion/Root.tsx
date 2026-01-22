import React from "react";
import { Composition } from "remotion";
import { DemoVideo } from "./DemoVideo";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={660} // 22 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
