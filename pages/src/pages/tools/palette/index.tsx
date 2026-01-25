import { useState, useMemo } from "react";
import easyMeshGradient, { defaultPointsGenerator } from "easy-mesh-gradient";
import type { Point } from "easy-mesh-gradient/types";
import { Card, Button, CodeBlock, CopyButton } from "../../../components/ui";
import CasinoIcon from "@mui/icons-material/CasinoOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
  };
  return [f(0), f(8), f(4)];
}

interface ColorSwatchProps {
  point: Point;
  index: number;
}

function ColorSwatch({ point, index }: ColorSwatchProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const hex = hslToHex(point.h, point.s, point.l);
  const rgb = hslToRgb(point.h, point.s, point.l);
  const hsl = `hsl(${Math.round(point.h)}, ${Math.round(point.s * 100)}%, ${Math.round(point.l * 100)}%)`;

  const copyColor = async (format: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(format);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Card className="overflow-hidden p-0">
      <div
        className="h-24"
        style={{ backgroundColor: hex }}
      />
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">Color {index + 1}</span>
        </div>
        <div className="space-y-1.5">
          <button
            onClick={() => copyColor("hex", hex)}
            className="w-full flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <span className="text-sm font-mono text-gray-700">{hex.toUpperCase()}</span>
            <ContentCopyIcon
              style={{ fontSize: 14 }}
              className={copied === "hex" ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"}
            />
          </button>
          <button
            onClick={() => copyColor("rgb", `rgb(${rgb.join(", ")})`)}
            className="w-full flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <span className="text-sm font-mono text-gray-700">rgb({rgb.join(", ")})</span>
            <ContentCopyIcon
              style={{ fontSize: 14 }}
              className={copied === "rgb" ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"}
            />
          </button>
          <button
            onClick={() => copyColor("hsl", hsl)}
            className="w-full flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <span className="text-sm font-mono text-gray-700 truncate">{hsl}</span>
            <ContentCopyIcon
              style={{ fontSize: 14 }}
              className={copied === "hsl" ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"}
            />
          </button>
        </div>
      </div>
    </Card>
  );
}

export function ColorPalettePage() {
  const [seed, setSeed] = useState("palette-demo");
  const [pointCount, setPointCount] = useState(5);

  const points = useMemo(
    () => defaultPointsGenerator({ seed, pointCount }),
    [seed, pointCount]
  );

  const gradient = useMemo(
    () => easyMeshGradient({ points }),
    [points]
  );

  const cssVariables = useMemo(() => {
    return points
      .map((p, i) => `  --color-${i + 1}: ${hslToHex(p.h, p.s, p.l)};`)
      .join("\n");
  }, [points]);

  const cssCode = `:root {\n${cssVariables}\n}`;

  const randomize = () => {
    setSeed((Math.random() + 1).toString(36));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          Color Palette Extractor
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Generate beautiful color palettes from mesh gradients. Copy colors in
          any format or export as CSS variables.
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Number of colors:
              </label>
              <select
                value={pointCount}
                onChange={(e) => setPointCount(parseInt(e.target.value))}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
              >
                {[3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} colors
                  </option>
                ))}
              </select>
            </div>
            <Button variant="secondary" onClick={randomize}>
              <CasinoIcon style={{ fontSize: 18 }} />
              Generate New Palette
            </Button>
          </div>
          <div
            className="h-32 rounded-xl shadow-lg"
            style={{ backgroundImage: gradient }}
          />
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {points.map((point, i) => (
            <ColorSwatch key={i} point={point} index={i} />
          ))}
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">CSS Variables</h2>
            <CopyButton text={cssCode} />
          </div>
          <CodeBlock code={cssCode} language="css" showCopy={false} />
        </Card>
      </div>
    </div>
  );
}
