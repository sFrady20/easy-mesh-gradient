import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Slider } from "../../components/slider";
import easyMeshGradient from "easy-mesh-gradient";
import { GradientOptions, Point } from "easy-mesh-gradient/types";
import { ColorInput } from "../../components/color-input";

const editorStore = create(
  immer<GradientOptions & { points: Point[] }>((x) => ({
    points: [
      { x: 0.1, y: 0.1, h: 120, s: 0.8, l: 0.6, scale: 1 },
      { x: 0.5, y: 0.5, h: 60, s: 0.7, l: 0.5, scale: 1.5 },
      { x: 0.9, y: 0.9, h: 300, s: 0.6, l: 0.4, scale: 1 },
    ],
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

  const gradient = easyMeshGradient(state);

  return (
    <div className="flex-1 flex flex-row gap-3 p-6">
      <div className="flex-1 flex flex-col">
        <div
          className="rounded-2xl shadow-2xl shadow-gray-500 sticky top-6 h-[calc(100vh-48px)]"
          style={{ backgroundImage: `${gradient}` }}
        />
      </div>
      <div className="flex flex-col w-[320px] max-w-screen p-3 gap-4">
        {state.points.map((point, i) => {
          return (
            <div className="flex flex-row gap-3">
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
            </div>
          );
        })}
        <div className="flex flex-col gap-4">
          <code className="bg-gray-200 p-4">
            {JSON.stringify(state, null, "  ")}
          </code>
          <code className="bg-gray-200 p-4">{gradient}</code>
        </div>
      </div>
    </div>
  );
};
