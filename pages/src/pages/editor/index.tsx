import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Slider } from "../../components/slider";
import easyMeshGradient from "easy-mesh-gradient";
import { GradientOptions, Point } from "easy-mesh-gradient/types";
import { ColorInput } from "../../components/color-input";
import { Cancel, Reorder } from "@mui/icons-material";
import { ItemInterface, ReactSortable } from "react-sortablejs";
import { useRef } from "react";

function makeRandomPoint() {
  return {
    id: Math.random().toString(32).substring(7),
    x: Math.random() * 0.9 + 0.05,
    y: Math.random() * 0.9 + 0.05,
    h: Math.random() * 360,
    s: Math.random(),
    l: Math.random(),
    scale: Math.random() + 0.5,
  };
}

const editorStore = create(
  immer<GradientOptions & { points: (Point & ItemInterface)[] }>((x) => ({
    points: new Array(3).fill("").map((x) => makeRandomPoint()),
    easingStops: 20,
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
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
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
  if (max === min) return [0, 0, l]; // achromatic

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h /= 6;

  return [h, s, l];
}

export const EditorPage = function () {
  const state = editorStore();
  const points = editorStore((x) => x.points);

  const gradient = easyMeshGradient(state);
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 flex flex-row gap-3 p-6">
      <div className="flex-1 flex flex-col">
        <div
          className="relative rounded-2xl shadow-2xl shadow-gray-500 sticky top-6 h-[calc(100vh-48px)]"
          style={{ backgroundImage: `${gradient}` }}
          ref={previewRef}
        >
          {points.map((point, i) => (
            <div
              className="absolute w-5 h-5 transform -translate-x-1/2 -translate-y-1/2 bg-[white] shadow rounded-full border hover:scale-[1.2] flex flex-col justify-center items-center"
              style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
              key={point.id}
              onDrag={(e) => {
                if (!previewRef.current) return;
                if (e.screenX === 0) return;

                const parentBox = previewRef.current.getBoundingClientRect();

                editorStore.setState((x) => {
                  x.points[i].x = (e.clientX - parentBox.x) / parentBox.width;
                  x.points[i].y = (e.clientY - parentBox.y) / parentBox.height;
                });
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: hslToHex(
                    point.h,
                    point.s * 100,
                    point.l * 100
                  ),
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <ReactSortable
        className="flex flex-col w-[320px] max-w-screen p-3 gap-4"
        handle=".sortable-handle"
        list={points.map((x) => ({ ...x }))}
        setList={(newPoints) => {
          editorStore.setState((x) => {
            x.points = JSON.parse(JSON.stringify(newPoints));
          });
        }}
      >
        {state.points.map((point, i) => {
          return (
            <div key={point.id} className="flex flex-row gap-3">
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
                    ).toFixed(1)}%,${Math.min(80, point.l * 100).toFixed(1)}%)`,
                  } as any
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
              <div className="flex flex-row items-center">
                <button className="p-2 hover:bg-gray-200 rounded-lg flex flex-col items-center justify-center sortable-handle">
                  <Reorder />
                </button>
                <button
                  className="p-2 hover:bg-gray-200 rounded-lg flex flex-col items-center justify-center"
                  onClick={() => {
                    editorStore.setState((x) => {
                      x.points.splice(i, 1);
                    });
                  }}
                >
                  <Cancel />
                </button>
              </div>
            </div>
          );
        })}
        <button
          className="bg-black rounded-full text-white text-sm font-medium p-3"
          onClick={() => {
            editorStore.setState((x) => {
              x.points.push(makeRandomPoint());
            });
          }}
        >
          Add Point
        </button>
        <div className="flex flex-col gap-4">
          <code className="bg-gray-200 p-4">
            {JSON.stringify(state, null, "  ")}
          </code>
          {/* <code className="bg-gray-200 p-4">{gradient}</code> */}
        </div>
      </ReactSortable>
    </div>
  );
};
