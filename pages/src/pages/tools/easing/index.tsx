import { useState, useEffect, useMemo } from "react";
import {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInOutSine,
  easeInOutExpo,
} from "easy-mesh-gradient";
import easyMeshGradient from "easy-mesh-gradient";
import { Card, CodeBlock } from "../../../components/ui";

type EasingFunction = (x: number) => number;

const easingFunctions: { name: string; fn: EasingFunction }[] = [
  { name: "linear", fn: linear },
  { name: "easeInQuad", fn: easeInQuad },
  { name: "easeOutQuad", fn: easeOutQuad },
  { name: "easeInOutQuad", fn: easeInOutQuad },
  { name: "easeInCubic", fn: easeInCubic },
  { name: "easeOutCubic", fn: easeOutCubic },
  { name: "easeInOutCubic", fn: easeInOutCubic },
  { name: "easeInOutSine", fn: easeInOutSine },
  { name: "easeInOutExpo", fn: easeInOutExpo },
];

function EasingCurve({
  fn,
  isActive,
}: {
  fn: EasingFunction;
  isActive: boolean;
}) {
  const points = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 50; i++) {
      const x = i / 50;
      const y = fn(x);
      pts.push(`${10 + x * 80},${90 - y * 80}`);
    }
    return pts.join(" ");
  }, [fn]);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        fill="none"
        stroke={isActive ? "#e5e7eb" : "#f3f4f6"}
        strokeWidth="1"
      />
      <polyline
        points={points}
        fill="none"
        stroke={isActive ? "#111827" : "#9ca3af"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnimatedBall({ fn, progress }: { fn: EasingFunction; progress: number }) {
  const easedProgress = fn(progress);

  return (
    <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
      <div
        className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-900 rounded-full shadow-lg transition-none"
        style={{ left: `calc(${easedProgress * 100}% - 16px)` }}
      />
    </div>
  );
}

export function EasingVisualizerPage() {
  const [selected, setSelected] = useState("easeInOutCubic");
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const selectedFn = useMemo(
    () => easingFunctions.find((e) => e.name === selected)?.fn || easeInOutCubic,
    [selected]
  );

  const gradient = useMemo(
    () => easyMeshGradient({ seed: "easing-demo", easing: selectedFn }),
    [selectedFn]
  );

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) {
          setIsPlaying(false);
          return 0;
        }
        return p + 0.02;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const codeSnippet = `import { easyMeshGradient, ${selected} } from "easy-mesh-gradient";

const gradient = easyMeshGradient({
  easing: ${selected},
  pointCount: 5,
});`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          Easing Visualizer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore how different easing functions affect gradient transitions.
          Choose an easing function to see its curve and effect on the gradient.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Easing Functions
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {easingFunctions.map((easing) => (
                <button
                  key={easing.name}
                  onClick={() => setSelected(easing.name)}
                  className={`
                    p-3 rounded-xl border-2 transition-all duration-200
                    ${
                      selected === easing.name
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-100 hover:border-gray-200"
                    }
                  `}
                >
                  <div className="aspect-square mb-2">
                    <EasingCurve
                      fn={easing.fn}
                      isActive={selected === easing.name}
                    />
                  </div>
                  <p
                    className={`text-xs font-medium truncate ${
                      selected === easing.name
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {easing.name}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Animation Preview
            </h2>
            <AnimatedBall fn={selectedFn} progress={progress} />
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() => {
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Play Animation
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={progress}
                onChange={(e) => {
                  setIsPlaying(false);
                  setProgress(parseFloat(e.target.value));
                }}
                className="flex-1"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Gradient Preview
            </h2>
            <div
              className="aspect-square rounded-xl shadow-lg"
              style={{ backgroundImage: gradient }}
            />
            <p className="mt-3 text-sm text-gray-500 text-center">
              Using {selected}
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Usage Code
            </h2>
            <CodeBlock code={codeSnippet} />
          </Card>
        </div>
      </div>
    </div>
  );
}
