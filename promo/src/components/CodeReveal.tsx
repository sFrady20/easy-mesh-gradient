import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily } = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// Actual lines of code
const CODE_LINES = [
  'import easyMeshGradient from "easy-mesh-gradient";',
  "",
  "const gradient = easyMeshGradient();",
];

// Timing constants
const CHARS_PER_FRAME = 2;
const LINE_DELAY = 8; // Frames to pause between lines

// Calculate total typing duration
const calculateTypingDuration = () => {
  let totalFrames = 0;
  CODE_LINES.forEach((line, i) => {
    totalFrames += line.length / CHARS_PER_FRAME;
    if (i < CODE_LINES.length - 1) {
      totalFrames += LINE_DELAY;
    }
  });
  return Math.ceil(totalFrames);
};

export const CODE_COMPLETE_FRAME = calculateTypingDuration() + 10;

// Syntax highlighting with regex
const highlightCode = (text: string): React.ReactNode[] => {
  const result: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Check for string (quoted text)
    const stringMatch = remaining.match(/^"[^"]*"/);
    if (stringMatch) {
      result.push(
        <span key={key++} style={{ color: "#a3e635" }}>
          {stringMatch[0]}
        </span>,
      );
      remaining = remaining.slice(stringMatch[0].length);
      continue;
    }

    // Check for keywords
    const keywordMatch = remaining.match(/^(import|from|const|let|var)\b/);
    if (keywordMatch) {
      result.push(
        <span key={key++} style={{ color: "#c084fc" }}>
          {keywordMatch[0]}
        </span>,
      );
      remaining = remaining.slice(keywordMatch[0].length);
      continue;
    }

    // Check for function call
    const funcMatch = remaining.match(/^(\w+)\(/);
    if (funcMatch) {
      result.push(
        <span key={key++} style={{ color: "#60a5fa" }}>
          {funcMatch[1]}
        </span>,
      );
      remaining = remaining.slice(funcMatch[1].length);
      continue;
    }

    // Check for punctuation
    const punctMatch = remaining.match(/^[();={},]/);
    if (punctMatch) {
      result.push(
        <span key={key++} style={{ color: "#71717a" }}>
          {punctMatch[0]}
        </span>,
      );
      remaining = remaining.slice(1);
      continue;
    }

    // Default: take one character
    result.push(
      <span key={key++} style={{ color: "#e4e4e7" }}>
        {remaining[0]}
      </span>,
    );
    remaining = remaining.slice(1);
  }

  return result;
};

interface CodeRevealProps {
  fadeOutStart?: number;
}

export const CodeReveal: React.FC<CodeRevealProps> = ({
  fadeOutStart = 999,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate which characters are visible
  let currentFrame = 0;
  const visibleLines: string[] = [];

  for (let i = 0; i < CODE_LINES.length; i++) {
    const line = CODE_LINES[i];
    const lineStartFrame = currentFrame;
    const lineEndFrame = currentFrame + line.length / CHARS_PER_FRAME;

    if (frame >= lineStartFrame) {
      const charsVisible = Math.min(
        line.length,
        Math.floor((frame - lineStartFrame) * CHARS_PER_FRAME),
      );
      visibleLines.push(line.slice(0, charsVisible));
    }

    currentFrame = lineEndFrame + LINE_DELAY;
  }

  // Cursor blink
  const cursorVisible = Math.floor(frame / 8) % 2 === 0;

  // Fade out animation
  const fadeOutProgress = spring({
    frame: frame - fadeOutStart,
    fps,
    config: { damping: 200 },
  });
  const opacity = interpolate(fadeOutProgress, [0, 1], [1, 0]);
  const translateY = interpolate(fadeOutProgress, [0, 1], [0, -30]);

  return (
    <div
      style={{
        fontFamily,
        fontSize: 26,
        lineHeight: 1.7,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Code window chrome */}
      <div
        style={{
          backgroundColor: "#18181b",
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid #27272a",
          minWidth: 700,
        }}
      >
        {/* Window dots */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#ef4444",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#eab308",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#22c55e",
            }}
          />
        </div>

        {/* Code content */}
        <div>
          {visibleLines.map((line, i) => (
            <div key={i} style={{ minHeight: 36 }}>
              {highlightCode(line)}
              {i === visibleLines.length - 1 && cursorVisible && (
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 22,
                    backgroundColor: "#a855f7",
                    marginLeft: 1,
                    verticalAlign: "middle",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
