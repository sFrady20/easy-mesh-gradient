import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import easyMeshGradient from "easy-mesh-gradient";

const gradient = easyMeshGradient({
  points: [
    {
      x: 0.857,
      y: 0.155,
      h: 209.2,
      s: 0.899,
      l: 0.779,
      scale: 0.559,
    },
    {
      x: 0.246,
      y: 0.096,
      h: 44.4,
      s: 0.917,
      l: 0.654,
      scale: 1.077,
    },
    {
      x: 0.051,
      y: 0.278,
      h: 89.5,
      s: 0.813,
      l: 0.749,
      scale: 1.244,
    },
    {
      x: 0.49,
      y: 0.772,
      h: 240.2,
      s: 0.848,
      l: 0.558,
      scale: 1.035,
    },
  ],
});

interface GradientRevealProps {
  startFrame: number;
}

export const GradientReveal: React.FC<GradientRevealProps> = ({
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 30, stiffness: 80 },
  });

  // Scale from small circle to full screen
  const scale = interpolate(revealProgress, [0, 1], [0, 1.5]);
  const opacity = interpolate(revealProgress, [0, 0.3, 1], [0, 1, 1]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 1080,
          height: 1080,
          borderRadius: "50%",
          backgroundImage: gradient,
          transform: `scale(${scale})`,
          opacity,
        }}
      />
    </AbsoluteFill>
  );
};
