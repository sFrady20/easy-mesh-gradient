import { useMemo, useRef, useState } from "react";
import {
  easings,
  hexToHsl,
  pointToHex,
  pointToHsl,
  pointToOklch,
  pointToRgb,
  type EasingName,
  type Point,
} from "easy-mesh-gradient";
import {
  ColorSwatch,
  RangeField,
  Section,
  Segmented,
  SliderField,
  Slider,
} from "../../components/controls";
import {
  CheckIcon,
  CopyIcon,
  GripIcon,
  PlusIcon,
  ShuffleIcon,
  XIcon,
} from "../../components/icons";
import { useEditorStore, type GeneratorKind } from "./store";

const percent = (v: number) => `${Math.round(v * 100)}%`;

type ColorFormat = "hex" | "rgb" | "hsl" | "oklch";

const colorFormatters: Record<ColorFormat, (p: Point) => string> = {
  hex: pointToHex,
  rgb: pointToRgb,
  hsl: pointToHsl,
  oklch: pointToOklch,
};

function GenerateSection() {
  const generation = useEditorStore((s) => s.generation);
  const setGeneration = useEditorStore((s) => s.setGeneration);
  const shuffle = useEditorStore((s) => s.shuffle);
  const dirty = useEditorStore((s) => s.dirty);
  const [showRanges, setShowRanges] = useState(false);

  return (
    <Section title="Generate">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {/* Manual point edits detach the gradient from its seed */}
          <input
            type="text"
            value={dirty ? "" : generation.seed}
            onChange={(e) => setGeneration({ seed: e.target.value })}
            placeholder={dirty ? "edited manually — type a seed" : "Seed"}
            className="h-9 min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 font-mono text-[13px] focus:border-gray-400 focus:bg-white focus:outline-none"
            aria-label="Seed"
          />
          <button
            onClick={shuffle}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white transition-colors hover:bg-gray-700"
            aria-label="Shuffle seed"
          >
            <ShuffleIcon size={15} />
          </button>
        </div>

        <Segmented<GeneratorKind>
          options={[
            { value: "scatter", label: "Scatter" },
            { value: "grid", label: "Grid" },
          ]}
          value={generation.generator}
          onChange={(generator) => setGeneration({ generator })}
        />

        {generation.generator === "scatter" ? (
          <SliderField
            label="Points"
            value={generation.pointCount}
            min={1}
            max={10}
            step={1}
            onChange={(e) =>
              setGeneration({ pointCount: Number(e.target.value) })
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <SliderField
              label="Columns"
              value={generation.gridCols}
              min={2}
              max={5}
              step={1}
              onChange={(e) =>
                setGeneration({ gridCols: Number(e.target.value) })
              }
            />
            <SliderField
              label="Rows"
              value={generation.gridRows}
              min={2}
              max={5}
              step={1}
              onChange={(e) =>
                setGeneration({ gridRows: Number(e.target.value) })
              }
            />
          </div>
        )}

        <button
          onClick={() => setShowRanges(!showRanges)}
          className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          {showRanges ? "Hide color & scale ranges" : "Color & scale ranges…"}
        </button>

        {showRanges && (
          <div className="space-y-4 rounded-xl bg-gray-50 p-3">
            <RangeField
              label="Hue"
              value={generation.hueRange}
              min={0}
              max={360}
              step={5}
              format={(v) => `${v}°`}
              onChange={(hueRange) => setGeneration({ hueRange })}
            />
            <RangeField
              label="Saturation"
              value={generation.saturationRange}
              min={0}
              max={1}
              step={0.01}
              format={percent}
              onChange={(saturationRange) => setGeneration({ saturationRange })}
            />
            <RangeField
              label="Lightness"
              value={generation.lightnessRange}
              min={0}
              max={1}
              step={0.01}
              format={percent}
              onChange={(lightnessRange) => setGeneration({ lightnessRange })}
            />
            <RangeField
              label="Scale"
              value={generation.scaleRange}
              min={0.1}
              max={3}
              step={0.05}
              format={(v) => v.toFixed(2)}
              onChange={(scaleRange) => setGeneration({ scaleRange })}
            />
          </div>
        )}
      </div>
    </Section>
  );
}

function PointsSection() {
  const points = useEditorStore((s) => s.points);
  const updatePoint = useEditorStore((s) => s.updatePoint);
  const removePoint = useEditorStore((s) => s.removePoint);
  const addPoint = useEditorStore((s) => s.addPoint);
  const movePoint = useEditorStore((s) => s.movePoint);
  const dragFrom = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  // Rows are only draggable while the grip is pressed, so the sliders
  // and swatches stay interactive
  const [armed, setArmed] = useState<number | null>(null);
  const [colorFormat, setColorFormat] = useState<ColorFormat>("hex");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1200);
  };

  const cssVariables = `:root {\n${points
    .map(
      (p, i) =>
        `  --gradient-color-${i + 1}: ${colorFormatters[colorFormat](p)};`
    )
    .join("\n")}\n}`;

  return (
    <Section
      title={`Points · ${points.length}`}
      defaultOpen={false}
      action={
        <button
          onClick={addPoint}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <PlusIcon size={13} />
          Add
        </button>
      }
    >
      <ul className="space-y-1.5">
        {points.map((point, i) => (
          <li
            key={point.id}
            draggable={armed === i}
            onDragStart={() => (dragFrom.current = i)}
            onDragEnd={() => {
              setArmed(null);
              setDragOver(null);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(i);
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => {
              if (dragFrom.current !== null) movePoint(dragFrom.current, i);
              dragFrom.current = null;
              setArmed(null);
              setDragOver(null);
            }}
            className={`space-y-1.5 rounded-xl bg-gray-50 p-2 transition-shadow ${
              dragOver === i ? "ring-2 ring-gray-300" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                onPointerDown={() => setArmed(i)}
                onPointerUp={() => setArmed(null)}
                className="cursor-grab touch-none text-gray-300 hover:text-gray-500 active:cursor-grabbing"
              >
                <GripIcon size={14} />
              </span>
              <ColorSwatch
                value={pointToHex(point)}
                onChange={(hex) => {
                  const hsl = hexToHsl(hex);
                  if (hsl) updatePoint(point.id, hsl);
                }}
                size={22}
              />
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-gray-600">
                {colorFormatters[colorFormat](point)}
              </span>
              {i === 0 && (
                <span className="rounded-md bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-gray-600 uppercase">
                  Base
                </span>
              )}
              <button
                onClick={() =>
                  copy(point.id, colorFormatters[colorFormat](point))
                }
                className="shrink-0 rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label={`Copy color as ${colorFormat}`}
              >
                {copied === point.id ? (
                  <CheckIcon size={14} className="text-green-600" />
                ) : (
                  <CopyIcon size={14} />
                )}
              </button>
              <button
                onClick={() => removePoint(point.id)}
                className="shrink-0 rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Remove point"
              >
                <XIcon size={14} />
              </button>
            </div>
            <div className="pr-1 pl-6">
              <Slider
                value={point.scale}
                min={0.1}
                max={3}
                step={0.01}
                color={pointToHsl({ ...point, l: Math.min(point.l, 0.7) })}
                onChange={(e) =>
                  updatePoint(point.id, { scale: Number(e.target.value) })
                }
                aria-label="Point scale"
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center gap-2">
        <Segmented<ColorFormat>
          options={[
            { value: "hex", label: "Hex" },
            { value: "rgb", label: "RGB" },
            { value: "hsl", label: "HSL" },
            { value: "oklch", label: "OKLCH" },
          ]}
          value={colorFormat}
          onChange={setColorFormat}
          className="flex-1"
        />
        <button
          onClick={() => copy("css-vars", cssVariables)}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
          title="Copy all colors as CSS variables"
        >
          {copied === "css-vars" ? (
            <CheckIcon size={13} className="text-green-600" />
          ) : (
            <CopyIcon size={13} />
          )}
          CSS vars
        </button>
      </div>
    </Section>
  );
}

export function EasingCurve({
  name,
  className = "",
}: {
  name: EasingName;
  className?: string;
}) {
  const points = useMemo(() => {
    const fn = easings[name];
    const pts: string[] = [];
    for (let i = 0; i <= 30; i++) {
      const x = i / 30;
      pts.push(`${5 + x * 90},${95 - fn(x) * 90}`);
    }
    return pts.join(" ");
  }, [name]);

  return (
    <svg viewBox="0 0 100 100" className={className}>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EasingSection() {
  const easingName = useEditorStore((s) => s.easingName);
  const easingStops = useEditorStore((s) => s.easingStops);
  const setEasingName = useEditorStore((s) => s.setEasingName);
  const setEasingStops = useEditorStore((s) => s.setEasingStops);

  return (
    <Section title="Easing" defaultOpen={false}>
      <div className="grid grid-cols-3 gap-1.5">
        {(Object.keys(easings) as EasingName[]).map((name) => (
          <button
            key={name}
            onClick={() => setEasingName(name)}
            title={name}
            className={`flex flex-col items-center gap-0.5 rounded-xl border p-2 transition-all ${
              easingName === name
                ? "border-gray-900 bg-gray-50 text-gray-900"
                : "border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600"
            }`}
          >
            <EasingCurve name={name} className="h-7 w-7" />
            <span className="w-full truncate text-center text-[10px] font-medium">
              {name === "linear" ? "linear" : name.replace("ease", "")}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4">
        <SliderField
          label="Smoothness (color stops)"
          value={easingStops}
          min={4}
          max={30}
          step={1}
          onChange={(e) => setEasingStops(Number(e.target.value))}
        />
      </div>
    </Section>
  );
}

export function DesignPanel() {
  return (
    <div className="space-y-3">
      <GenerateSection />
      <PointsSection />
      <EasingSection />
    </div>
  );
}
