import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily: interFont } = loadInter("normal", {
  weights: ["600"],
  subsets: ["latin"],
});

const { fontFamily: monoFont } = loadJetBrains("normal", {
  weights: ["500"],
  subsets: ["latin"],
});

interface OutroProps {
  startFrame: number;
}

export const Outro: React.FC<OutroProps> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const titleY = interpolate(titleProgress, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  // Install command animation (delayed)
  const installProgress = spring({
    frame: frame - startFrame - 15,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const installY = interpolate(installProgress, [0, 1], [30, 0]);
  const installOpacity = interpolate(installProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 32,
      }}
    >
      {/* Library name */}
      <div
        style={{
          fontFamily: interFont,
          fontSize: 72,
          fontWeight: 600,
          color: "white",
          textShadow: "0 4px 30px rgba(0,0,0,0.3)",
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          letterSpacing: "-0.02em",
        }}
      >
        easy-mesh-gradient
      </div>

      {/* Install command */}
      <div
        style={{
          fontFamily: monoFont,
          fontSize: 28,
          fontWeight: 500,
          color: "rgba(255,255,255,0.9)",
          backgroundColor: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(20px)",
          padding: "16px 32px",
          borderRadius: 12,
          transform: `translateY(${installY}px)`,
          opacity: installOpacity,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        npm install easy-mesh-gradient
      </div>
    </div>
  );
};
