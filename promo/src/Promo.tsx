import { AbsoluteFill } from "remotion";
import { CodeReveal } from "./components/CodeReveal";
import { GradientReveal } from "./components/GradientReveal";
import { Outro } from "./components/Outro";

// Timeline (CODE_COMPLETE_FRAME is ~60)
const GRADIENT_START = 75;
const CODE_FADE_START = 85;
const OUTRO_START = 100;

export const Promo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#09090b" }}>
      {/* Gradient expands from center */}
      <GradientReveal startFrame={GRADIENT_START} />

      {/* Code typing animation */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <CodeReveal fadeOutStart={CODE_FADE_START} />
      </AbsoluteFill>

      {/* Final title and install command */}
      <AbsoluteFill>
        <Outro startFrame={OUTRO_START} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
