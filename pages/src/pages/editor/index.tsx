import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Slider } from "../../components/slider";
import easyMeshGradient, {
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
import type { Point } from "easy-mesh-gradient/types";
import { ColorInput } from "../../components/color-input";
import { Cancel, Reorder } from "@mui/icons-material";
import { type ItemInterface, ReactSortable } from "react-sortablejs";
import { type RefObject, useRef, useState, useMemo } from "react";
import { Card, CopyButton } from "../../components/ui";

type EasingFunction = (x: number) => number;

const easingOptions: { name: string; fn: EasingFunction }[] = [
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

function makeRandomPoint() {
  return {
    id: Math.random().toString(32).substring(7),
    x: Math.random() * 0.9 + 0.05,
    y: Math.random() * 0.9 + 0.05,
    h: Math.random() * 360,
    s: Math.random() * 0.5 + 0.5,
    l: Math.random() * 0.3 + 0.5,
    scale: Math.random() + 0.5,
  };
}

interface EditorState {
  points: (Point & ItemInterface)[];
  easingName: string;
  easingStops: number;
}

const editorStore = create(
  immer<EditorState>(() => ({
    points: new Array(4).fill("").map(() => makeRandomPoint()),
    easingName: "easeInOutCubic",
    easingStops: 15,
  }))
);

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function hexToHsl(hex: string): [number, number, number] | undefined {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return undefined;

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h /= 6;

  return [h, s, l];
}

function EasingCurve({ fn }: { fn: EasingFunction }) {
  const points = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 30; i++) {
      const x = i / 30;
      const y = fn(x);
      pts.push(`${5 + x * 90},${95 - y * 90}`);
    }
    return pts.join(" ");
  }, [fn]);

  return (
    <svg viewBox="0 0 100 100" className="w-8 h-8">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const PointHandle = function (props: {
  point: Point & ItemInterface;
  previewRef: RefObject<HTMLDivElement | null>;
  index: number;
}) {
  const { point, previewRef, index } = props;

  return (
    <div
      draggable
      className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full border-2 border-white hover:scale-110 transition-transform flex flex-col justify-center items-center cursor-move"
      style={{
        left: `${point.x * 100}%`,
        top: `${point.y * 100}%`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
      onDrag={(e) => {
        if (!previewRef.current) return;
        if (e.screenX === 0) return;

        const parentBox = previewRef.current.getBoundingClientRect();

        editorStore.setState((x) => {
          x.points[index].x = Math.max(
            0,
            Math.min(1, (e.clientX - parentBox.x) / parentBox.width)
          );
          x.points[index].y = Math.max(
            0,
            Math.min(1, (e.clientY - parentBox.y) / parentBox.height)
          );
        });
      }}
    >
      <div
        className="w-4 h-4 rounded-full"
        style={{
          backgroundColor: hslToHex(point.h, point.s * 100, point.l * 100),
        }}
      />
    </div>
  );
};

type ExportFormat = "css" | "react" | "json" | "points";

export const EditorPage = function () {
  const state = editorStore();
  const points = editorStore((x) => x.points);
  const easingName = editorStore((x) => x.easingName);
  const easingStops = editorStore((x) => x.easingStops);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("css");

  const easingFn = useMemo(
    () => easingOptions.find((e) => e.name === easingName)?.fn || easeInOutCubic,
    [easingName]
  );

  const gradient = easyMeshGradient({
    points: state.points,
    easing: easingFn,
    easingStops,
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const exportCode = useMemo(() => {
    switch (exportFormat) {
      case "css":
        return `background-image: ${gradient};`;
      case "react":
        return `<div
  style={{
    backgroundImage: \`${gradient}\`,
  }}
/>`;
      case "json":
        return JSON.stringify(
          {
            points: state.points.map(({ x, y, h, s, l, scale }) => ({
              x,
              y,
              h,
              s,
              l,
              scale,
            })),
            easingStops,
          },
          null,
          2
        );
      case "points":
        return JSON.stringify(
          state.points.map(({ x, y, h, s, l, scale }) => ({
            x: +x.toFixed(3),
            y: +y.toFixed(3),
            h: +h.toFixed(1),
            s: +s.toFixed(3),
            l: +l.toFixed(3),
            scale: +scale.toFixed(3),
          })),
          null,
          2
        );
    }
  }, [exportFormat, gradient, state.points, easingStops]);

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
      {/* Preview */}
      <div className="flex-1 flex flex-col">
        <div
          className="relative rounded-2xl shadow-xl flex-1 min-h-[400px]"
          style={{ backgroundImage: gradient }}
          ref={previewRef}
        >
          {points.map((point, i) => (
            <PointHandle
              key={point.id}
              point={point}
              previewRef={previewRef}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="w-full lg:w-[380px] space-y-4 overflow-y-auto">
        {/* Easing */}
        <Card className="bg-white">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Easing Function
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {easingOptions.map((option) => (
              <button
                key={option.name}
                onClick={() =>
                  editorStore.setState((x) => {
                    x.easingName = option.name;
                  })
                }
                className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                  easingName === option.name
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <EasingCurve fn={option.fn} />
                <span
                  className={`text-[10px] truncate w-full text-center ${
                    easingName === option.name
                      ? "text-gray-900 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {option.name.replace("ease", "")}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-600">Easing Stops</label>
              <span className="text-sm font-medium text-gray-900">
                {easingStops}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={easingStops}
              onChange={(e) =>
                editorStore.setState((x) => {
                  x.easingStops = parseInt(e.target.value);
                })
              }
              className="w-full"
            />
          </div>
        </Card>

        {/* Points */}
        <Card className="bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">
              Points ({points.length})
            </h3>
            <button
              onClick={() =>
                editorStore.setState((x) => {
                  x.points.push(makeRandomPoint());
                })
              }
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              + Add Point
            </button>
          </div>

          <ReactSortable
            className="space-y-2"
            handle=".sortable-handle"
            list={points.map((x) => ({ ...x }))}
            setList={(newPoints) => {
              editorStore.setState((x) => {
                x.points = JSON.parse(JSON.stringify(newPoints));
              });
            }}
          >
            {state.points.map((point, i) => (
              <div
                key={point.id}
                className="flex flex-row items-center gap-2 p-2 bg-gray-50 rounded-lg"
              >
                <ColorInput
                  value={hslToHex(point.h, point.s * 100, point.l * 100)}
                  onChange={(e) => {
                    const hsl = hexToHsl(e.target.value);
                    if (!hsl) return;
                    editorStore.setState((x) => {
                      x.points[i].h = hsl[0] * 360;
                      x.points[i].s = hsl[1];
                      x.points[i].l = hsl[2];
                    });
                  }}
                />
                <Slider
                  className="flex-1"
                  style={
                    {
                      ["--color"]: `hsl(${point.h.toFixed(1)},${(
                        point.s * 100
                      ).toFixed(1)}%,${Math.min(80, point.l * 100).toFixed(
                        1
                      )}%)`,
                    } as React.CSSProperties
                  }
                  min={0}
                  max={2}
                  step={0.01}
                  value={point.scale}
                  onChange={(e) => {
                    editorStore.setState((x) => {
                      x.points[i].scale = parseFloat(`${e.target.value}`);
                    });
                  }}
                />
                <button className="p-1.5 hover:bg-gray-200 rounded-lg sortable-handle cursor-grab">
                  <Reorder style={{ fontSize: 18 }} className="text-gray-400" />
                </button>
                <button
                  className="p-1.5 hover:bg-gray-200 rounded-lg"
                  onClick={() => {
                    editorStore.setState((x) => {
                      x.points.splice(i, 1);
                    });
                  }}
                >
                  <Cancel style={{ fontSize: 18 }} className="text-gray-400" />
                </button>
              </div>
            ))}
          </ReactSortable>
        </Card>

        {/* Export */}
        <Card className="bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Export</h3>
            <CopyButton text={exportCode} />
          </div>

          <div className="flex gap-1 mb-3">
            {(["css", "react", "json", "points"] as ExportFormat[]).map(
              (format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    exportFormat === format
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              )
            )}
          </div>

          <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto max-h-48">
            <code>{exportCode}</code>
          </pre>
        </Card>
      </div>
    </div>
  );
};
