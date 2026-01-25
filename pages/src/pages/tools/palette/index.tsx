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

// Convert HSL to OKLCH (approximate conversion via sRGB -> Linear RGB -> OKLab -> OKLCH)
function hslToOklch(h: number, s: number, l: number): { L: number; C: number; H: number } {
  // First convert HSL to linear RGB
  const rgb = hslToRgb(h, s, l);
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  // sRGB to linear RGB
  const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  // Linear RGB to OKLab
  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bLab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  // OKLab to OKLCH
  const C = Math.sqrt(a * a + bLab * bLab);
  let H = Math.atan2(bLab, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  return { L, C, H };
}

type ColorFormat = "hex" | "rgb" | "hsl" | "oklch";

interface ColorSwatchProps {
  point: Point;
  index: number;
  format: ColorFormat;
}

function ColorSwatch({ point, index, format }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const hex = hslToHex(point.h, point.s, point.l);
  const rgb = hslToRgb(point.h, point.s, point.l);
  const oklch = hslToOklch(point.h, point.s, point.l);

  const formatValues: Record<ColorFormat, string> = {
    hex: hex.toUpperCase(),
    rgb: `rgb(${rgb.join(", ")})`,
    hsl: `hsl(${Math.round(point.h)} ${Math.round(point.s * 100)}% ${Math.round(point.l * 100)}%)`,
    oklch: `oklch(${(oklch.L * 100).toFixed(1)}% ${oklch.C.toFixed(3)} ${oklch.H.toFixed(1)})`,
  };

  const copyColor = async () => {
    await navigator.clipboard.writeText(formatValues[format]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="h-20" style={{ backgroundColor: hex }} />
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">Color {index + 1}</span>
        </div>
        <button
          onClick={copyColor}
          className="w-full flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
        >
          <span className="text-xs font-mono text-gray-700 truncate pr-2">
            {formatValues[format]}
          </span>
          <ContentCopyIcon
            style={{ fontSize: 12, flexShrink: 0 }}
            className={copied ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"}
          />
        </button>
      </div>
    </Card>
  );
}

export function ColorPalettePage() {
  const [seed, setSeed] = useState("palette-demo");
  const [pointCount, setPointCount] = useState(5);
  const [colorFormat, setColorFormat] = useState<ColorFormat>("hex");

  const points = useMemo(
    () => defaultPointsGenerator({ seed, pointCount }),
    [seed, pointCount]
  );

  const gradient = useMemo(() => easyMeshGradient({ points }), [points]);

  const cssVariables = useMemo(() => {
    return points
      .map((p, i) => {
        const hex = hslToHex(p.h, p.s, p.l);
        const rgb = hslToRgb(p.h, p.s, p.l);
        const oklch = hslToOklch(p.h, p.s, p.l);

        switch (colorFormat) {
          case "hex":
            return `  --color-${i + 1}: ${hex};`;
          case "rgb":
            return `  --color-${i + 1}: rgb(${rgb.join(", ")});`;
          case "hsl":
            return `  --color-${i + 1}: hsl(${Math.round(p.h)} ${Math.round(p.s * 100)}% ${Math.round(p.l * 100)}%);`;
          case "oklch":
            return `  --color-${i + 1}: oklch(${(oklch.L * 100).toFixed(1)}% ${oklch.C.toFixed(3)} ${oklch.H.toFixed(1)});`;
        }
      })
      .join("\n");
  }, [points, colorFormat]);

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
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Colors:</label>
                <select
                  value={pointCount}
                  onChange={(e) => setPointCount(parseInt(e.target.value))}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                >
                  {[3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Format:</label>
                <select
                  value={colorFormat}
                  onChange={(e) => setColorFormat(e.target.value as ColorFormat)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="hex">HEX</option>
                  <option value="rgb">RGB</option>
                  <option value="hsl">HSL</option>
                  <option value="oklch">OKLCH</option>
                </select>
              </div>
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
            <ColorSwatch key={i} point={point} index={i} format={colorFormat} />
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
