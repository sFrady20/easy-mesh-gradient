import { useEffect, useMemo, useRef, useState } from "react";
import {
  easings,
  renderMeshGradient,
  type EasingName,
  type Point,
} from "easy-mesh-gradient";
import { Segmented, SliderField } from "../../components/controls";
import { CopyButton } from "../../components/ui";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  XIcon,
} from "../../components/icons";
import {
  GENERATION_DEFAULTS,
  useEditorStore,
  type GenerationSettings,
} from "./store";

type ExportView = "code" | "image";

/** Points with editor ids stripped and values rounded for readable output. */
function cleanPoints(points: (Point & { id: string })[]) {
  return points.map(({ x, y, h, s, l, scale }) => ({
    x: +x.toFixed(3),
    y: +y.toFixed(3),
    h: +h.toFixed(1),
    s: +s.toFixed(3),
    l: +l.toFixed(3),
    scale: +scale.toFixed(3),
  }));
}

const rangesEqual = (a: [number, number], b: [number, number]) =>
  a[0] === b[0] && a[1] === b[1];

const formatRange = ([min, max]: [number, number]) =>
  `[${+min.toFixed(2)}, ${+max.toFixed(2)}]`;

/**
 * Builds the minimal library call that recreates the current gradient:
 * just the seed (plus non-default settings) while the points are
 * untouched, explicit points once they've been edited by hand.
 */
function buildLibraryCode(state: {
  dirty: boolean;
  generation: GenerationSettings;
  points: (Point & { id: string })[];
  easingName: EasingName;
  easingStops: number;
}): string {
  const { dirty, generation, points, easingName, easingStops } = state;
  const namedImports: string[] = [];
  const options: string[] = [];

  if (dirty) {
    options.push(
      `points: ${JSON.stringify(cleanPoints(points), null, 2).replace(/\n/g, "\n  ")},`
    );
  } else {
    options.push(`seed: ${JSON.stringify(generation.seed)},`);
    if (generation.generator === "grid") {
      namedImports.push("gridPointsGenerator");
      options.push(
        `pointsGenerator: (options) => gridPointsGenerator(options, ${generation.gridCols}, ${generation.gridRows}),`
      );
    } else if (generation.pointCount !== GENERATION_DEFAULTS.pointCount) {
      options.push(`pointCount: ${generation.pointCount},`);
    }
    if (!rangesEqual(generation.hueRange, GENERATION_DEFAULTS.hueRange)) {
      options.push(`hueRange: ${formatRange(generation.hueRange)},`);
    }
    if (
      !rangesEqual(
        generation.saturationRange,
        GENERATION_DEFAULTS.saturationRange
      )
    ) {
      options.push(
        `saturationRange: ${formatRange(generation.saturationRange)},`
      );
    }
    if (
      !rangesEqual(
        generation.lightnessRange,
        GENERATION_DEFAULTS.lightnessRange
      )
    ) {
      options.push(
        `lightnessRange: ${formatRange(generation.lightnessRange)},`
      );
    }
    if (!rangesEqual(generation.scaleRange, GENERATION_DEFAULTS.scaleRange)) {
      options.push(`scaleRange: ${formatRange(generation.scaleRange)},`);
    }
  }

  if (easingName !== GENERATION_DEFAULTS.easingName) {
    namedImports.push(easingName);
    options.push(`easing: ${easingName},`);
  }
  if (easingStops !== GENERATION_DEFAULTS.easingStops) {
    options.push(`easingStops: ${easingStops},`);
  }

  const importLine = `import easyMeshGradient${
    namedImports.length > 0 ? `, { ${namedImports.join(", ")} }` : ""
  } from "easy-mesh-gradient";`;

  return [
    importLine,
    "",
    "const gradient = easyMeshGradient({",
    ...options.map((line) => `  ${line}`),
    "});",
  ].join("\n");
}

/** Wrapping code block with a copy action — nothing gets cut off. */
function CodeOutput({
  code,
  maxHeight = "max-h-72",
}: {
  code: string;
  maxHeight?: string;
}) {
  return (
    <div>
      <pre
        className={`${maxHeight} overflow-y-auto rounded-xl bg-gray-900 p-3.5 font-mono text-xs leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] text-gray-100`}
      >
        <code>{code}</code>
      </pre>
      <div className="mt-2.5 flex justify-end">
        <CopyButton text={code} />
      </div>
    </div>
  );
}

function CodeExport() {
  const points = useEditorStore((s) => s.points);
  const easingName = useEditorStore((s) => s.easingName);
  const easingStops = useEditorStore((s) => s.easingStops);
  const generation = useEditorStore((s) => s.generation);
  const dirty = useEditorStore((s) => s.dirty);

  const [installCopied, setInstallCopied] = useState(false);

  const libraryCode = useMemo(
    () =>
      buildLibraryCode({ dirty, generation, points, easingName, easingStops }),
    [dirty, generation, points, easingName, easingStops]
  );

  const copyInstall = async () => {
    await navigator.clipboard.writeText("npm install easy-mesh-gradient");
    setInstallCopied(true);
    setTimeout(() => setInstallCopied(false), 1500);
  };

  return (
    <div className="space-y-3">
      <p className="text-[13px] leading-relaxed text-gray-500">
        {dirty
          ? "Points were edited by hand, so the code lists them explicitly."
          : "The seed recreates this exact gradient — no point data needed."}
      </p>

      <button
        onClick={copyInstall}
        className="group flex w-full items-center justify-between rounded-lg bg-gray-100 px-3 py-2 transition-colors hover:bg-gray-200/70"
      >
        <code className="font-mono text-xs text-gray-700">
          npm install easy-mesh-gradient
        </code>
        {installCopied ? (
          <CheckIcon size={13} className="text-green-600" />
        ) : (
          <CopyIcon
            size={13}
            className="text-gray-400 group-hover:text-gray-600"
          />
        )}
      </button>

      <CodeOutput code={libraryCode} maxHeight="max-h-80" />
    </div>
  );
}

const sizePresets = [
  { name: "Square", width: 1080, height: 1080 },
  { name: "Post 4:5", width: 1080, height: 1350 },
  { name: "Story 9:16", width: 1080, height: 1920 },
  { name: "Desktop 16:9", width: 1920, height: 1080 },
  { name: "Banner 3:1", width: 1500, height: 500 },
  { name: "Custom", width: 0, height: 0 },
] as const;

function ImageExport() {
  const points = useEditorStore((s) => s.points);
  const easingName = useEditorStore((s) => s.easingName);
  const easingStops = useEditorStore((s) => s.easingStops);
  const seed = useEditorStore((s) => s.generation.seed);

  const [presetIndex, setPresetIndex] = useState(0);
  const [custom, setCustom] = useState({ width: 1920, height: 1080 });
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [grainAmount, setGrainAmount] = useState(0);
  const [grainIntensity, setGrainIntensity] = useState(0.12);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const preset = sizePresets[presetIndex];
  const isCustom = preset.name === "Custom";
  const width = isCustom ? custom.width : preset.width;
  const height = isCustom ? custom.height : preset.height;

  const renderOptions = useMemo(
    () => ({
      points: points.map(({ x, y, h, s, l, scale }) => ({
        x,
        y,
        h,
        s,
        l,
        scale,
      })),
      easing: easings[easingName],
      easingStops,
      grain:
        grainAmount > 0
          ? { density: grainAmount, intensity: grainIntensity }
          : undefined,
    }),
    [points, easingName, easingStops, grainAmount, grainIntensity]
  );

  // Live preview at reduced resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;
    const scale = Math.min(1, 640 / Math.max(width, height));
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (ctx) renderMeshGradient(ctx, renderOptions);
  }, [renderOptions, width, height]);

  const download = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderMeshGradient(ctx, renderOptions);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `mesh-gradient-${seed || "custom"}.${format === "png" ? "png" : "jpg"}`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      },
      format === "png" ? "image/png" : "image/jpeg",
      format === "jpeg" ? 0.92 : undefined
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center rounded-xl bg-gray-100 p-3">
        <canvas
          ref={canvasRef}
          className="max-h-52 max-w-full rounded-lg shadow-md"
        />
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {sizePresets.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setPresetIndex(i)}
            className={`rounded-lg border px-2 py-1.5 text-center transition-all ${
              presetIndex === i
                ? "border-gray-900 bg-gray-50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <span className="block text-[11px] font-medium text-gray-900">
              {p.name}
            </span>
            <span className="block text-[10px] text-gray-400">
              {p.width > 0 ? `${p.width}×${p.height}` : "any size"}
            </span>
          </button>
        ))}
      </div>

      {isCustom && (
        <div className="grid grid-cols-2 gap-3">
          {(["width", "height"] as const).map((dim) => (
            <label key={dim} className="block">
              <span className="mb-1 block text-[13px] text-gray-600 capitalize">
                {dim}
              </span>
              <input
                type="number"
                min={16}
                max={8192}
                value={custom[dim]}
                onChange={(e) =>
                  setCustom((c) => ({
                    ...c,
                    [dim]: Math.max(0, Number(e.target.value) || 0),
                  }))
                }
                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 font-mono text-[13px] focus:border-gray-400 focus:bg-white focus:outline-none"
              />
            </label>
          ))}
        </div>
      )}

      <div className="space-y-4 rounded-xl bg-gray-50 p-3">
        <SliderField
          label="Grain amount"
          value={grainAmount}
          min={0}
          max={1}
          step={0.01}
          display={
            grainAmount === 0 ? "off" : `${Math.round(grainAmount * 100)}%`
          }
          onChange={(e) => setGrainAmount(Number(e.target.value))}
        />
        {grainAmount > 0 && (
          <SliderField
            label="Grain intensity"
            value={grainIntensity}
            min={0.02}
            max={0.5}
            step={0.01}
            display={`${Math.round(grainIntensity * 100)}%`}
            onChange={(e) => setGrainIntensity(Number(e.target.value))}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <Segmented<"png" | "jpeg">
          options={[
            { value: "png", label: "PNG" },
            { value: "jpeg", label: "JPEG" },
          ]}
          value={format}
          onChange={setFormat}
          className="flex-1"
        />
        <button
          onClick={download}
          disabled={width <= 0 || height <= 0}
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-40"
        >
          <DownloadIcon size={15} />
          Download
        </button>
      </div>
    </div>
  );
}

export function ExportModal({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<ExportView>("code");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/30 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Export gradient"
    >
      <div
        className="flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-3xl bg-white shadow-2xl animate-[fade-in_0.2s_ease-out] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="text-base font-semibold text-gray-900">Export</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <XIcon size={16} />
          </button>
        </header>

        <div className="px-5">
          <Segmented<ExportView>
            options={[
              { value: "code", label: "Code" },
              { value: "image", label: "Image" },
            ]}
            value={view}
            onChange={setView}
          />
        </div>

        <div className="overflow-y-auto px-5 py-4">
          {view === "code" ? <CodeExport /> : <ImageExport />}
        </div>
      </div>
    </div>
  );
}
