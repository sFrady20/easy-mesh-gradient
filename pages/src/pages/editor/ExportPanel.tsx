import { useEffect, useMemo, useRef, useState } from "react";
import {
  easings,
  pointToHex,
  pointToHsl,
  pointToOklch,
  pointToRgb,
  renderMeshGradient,
  type Point,
} from "easy-mesh-gradient";
import { Segmented, Section } from "../../components/controls";
import { CopyButton } from "../../components/ui";
import { CheckIcon, CopyIcon, DownloadIcon } from "../../components/icons";
import { useEditorStore } from "./store";

type CodeFormat = "css" | "react" | "code" | "json";
type ExportTab = CodeFormat | "palette" | "image";
type ColorFormat = "hex" | "rgb" | "hsl" | "oklch";

const colorFormatters: Record<ColorFormat, (p: Point) => string> = {
  hex: pointToHex,
  rgb: pointToRgb,
  hsl: pointToHsl,
  oklch: pointToOklch,
};

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

export function ExportPanel({ gradient }: { gradient: string }) {
  const points = useEditorStore((s) => s.points);
  const easingName = useEditorStore((s) => s.easingName);
  const easingStops = useEditorStore((s) => s.easingStops);

  const [tab, setTab] = useState<ExportTab>("css");

  const code = useMemo(() => {
    const cleaned = cleanPoints(points);
    switch (tab) {
      case "css":
        return `background-image: ${gradient};`;
      case "react":
        return `<div\n  style={{\n    backgroundImage: \`${gradient}\`,\n  }}\n/>`;
      case "code":
        return [
          `import easyMeshGradient${easingName !== "easeInOutCubic" ? `, { ${easingName} }` : ""} from "easy-mesh-gradient";`,
          "",
          "const gradient = easyMeshGradient({",
          ...(easingName !== "easeInOutCubic"
            ? [`  easing: ${easingName},`]
            : []),
          `  easingStops: ${easingStops},`,
          `  points: ${JSON.stringify(cleaned, null, 2).replace(/\n/g, "\n  ")},`,
          "});",
        ].join("\n");
      case "json":
        return JSON.stringify(
          { points: cleaned, easing: easingName, easingStops },
          null,
          2
        );
      default:
        return "";
    }
  }, [tab, gradient, points, easingName, easingStops]);

  return (
    <div className="space-y-3">
      <Section title="Export">
        <Segmented<ExportTab>
          options={[
            { value: "css", label: "CSS" },
            { value: "react", label: "React" },
            { value: "code", label: "Code" },
            { value: "json", label: "JSON" },
            { value: "palette", label: "Palette" },
            { value: "image", label: "Image" },
          ]}
          value={tab}
          onChange={setTab}
        />

        <div className="mt-3">
          {tab === "palette" ? (
            <PaletteExport />
          ) : tab === "image" ? (
            <ImageExport />
          ) : (
            <div>
              <pre className="max-h-72 overflow-auto rounded-xl bg-gray-900 p-3.5 font-mono text-xs leading-relaxed text-gray-100">
                <code>{code}</code>
              </pre>
              <div className="mt-2.5 flex justify-end">
                <CopyButton text={code} />
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

function PaletteExport() {
  const points = useEditorStore((s) => s.points);
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const colors = points.map((p) => colorFormatters[format](p));
  const cssVariables = `:root {\n${colors
    .map((c, i) => `  --gradient-color-${i + 1}: ${c};`)
    .join("\n")}\n}`;

  const copyColor = async (color: string, index: number) => {
    await navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  return (
    <div className="space-y-3">
      <Segmented<ColorFormat>
        options={[
          { value: "hex", label: "Hex" },
          { value: "rgb", label: "RGB" },
          { value: "hsl", label: "HSL" },
          { value: "oklch", label: "OKLCH" },
        ]}
        value={format}
        onChange={setFormat}
      />

      <ul className="space-y-1.5">
        {points.map((point, i) => (
          <li key={i}>
            <button
              onClick={() => copyColor(colors[i], i)}
              className="group flex w-full items-center gap-2.5 rounded-xl bg-gray-50 p-2 text-left transition-colors hover:bg-gray-100"
            >
              <span
                className="h-7 w-7 shrink-0 rounded-full border border-black/10 shadow-sm"
                style={{ backgroundColor: pointToHex(point) }}
              />
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-gray-700">
                {colors[i]}
              </span>
              <span className="shrink-0 text-gray-300 group-hover:text-gray-500">
                {copiedIndex === i ? (
                  <CheckIcon size={14} className="text-green-600" />
                ) : (
                  <CopyIcon size={14} />
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div>
        <pre className="max-h-48 overflow-auto rounded-xl bg-gray-900 p-3.5 font-mono text-xs leading-relaxed text-gray-100">
          <code>{cssVariables}</code>
        </pre>
        <div className="mt-2.5 flex justify-end">
          <CopyButton text={cssVariables} />
        </div>
      </div>
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
    }),
    [points, easingName, easingStops]
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
