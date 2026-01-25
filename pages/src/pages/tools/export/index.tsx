import { useState, useRef, useEffect, useMemo } from "react";
import easyMeshGradient from "easy-mesh-gradient";
import { Card, Button } from "../../../components/ui";
import CasinoIcon from "@mui/icons-material/CasinoOutlined";
import DownloadIcon from "@mui/icons-material/Download";

const sizePresets = [
  { name: "Square (1:1)", width: 1080, height: 1080 },
  { name: "Instagram Post", width: 1080, height: 1350 },
  { name: "Twitter Header", width: 1500, height: 500 },
  { name: "Facebook Cover", width: 820, height: 312 },
  { name: "Desktop (16:9)", width: 1920, height: 1080 },
  { name: "Mobile (9:16)", width: 1080, height: 1920 },
  { name: "Custom", width: 0, height: 0 },
];

export function GradientExportPage() {
  const [seed, setSeed] = useState("export-demo");
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const preset = sizePresets[selectedPreset];
  const width = preset.name === "Custom" ? customWidth : preset.width;
  const height = preset.name === "Custom" ? customHeight : preset.height;

  const gradient = useMemo(() => easyMeshGradient({ seed }), [seed]);

  const randomize = () => {
    setSeed((Math.random() + 1).toString(36));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Parse and render gradients
    const gradientParts = gradient.split(/,(?=\s*(?:radial|linear)-gradient)/);

    // Render in reverse order (last gradient is the base)
    for (let i = gradientParts.length - 1; i >= 0; i--) {
      const part = gradientParts[i].trim();

      if (part.startsWith("radial-gradient")) {
        const match = part.match(/at\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
        if (match) {
          const x = (parseFloat(match[1]) / 100) * width;
          const y = (parseFloat(match[2]) / 100) * height;
          const radius = Math.max(width, height);

          const radialGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);

          const colorStops = part.match(/hsla?\([^)]+\)\s*\d+%/g) || [];
          colorStops.forEach((stop) => {
            const colorMatch = stop.match(/(hsla?\([^)]+\))\s*(\d+)%/);
            if (colorMatch) {
              const position = parseFloat(colorMatch[2]) / 100;
              radialGrad.addColorStop(Math.min(1, position), colorMatch[1]);
            }
          });

          ctx.fillStyle = radialGrad;
          ctx.fillRect(0, 0, width, height);
        }
      } else if (part.startsWith("linear-gradient")) {
        const colorMatch = part.match(/hsla?\([^)]+\)/);
        if (colorMatch) {
          ctx.fillStyle = colorMatch[0];
          ctx.fillRect(0, 0, width, height);
        }
      }
    }
  }, [gradient, width, height]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `gradient-${seed}.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, format === "jpeg" ? 0.9 : undefined);
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          Export Gradient as Image
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Generate beautiful gradient images for social media, presentations, or
          design projects. Choose your size and download instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <div className="relative bg-gray-100 rounded-xl p-4 flex items-center justify-center min-h-[400px]">
              <div
                className="rounded-lg shadow-xl overflow-hidden"
                style={{
                  backgroundImage: gradient,
                  width: `min(100%, ${width}px)`,
                  aspectRatio: `${width} / ${height}`,
                  maxHeight: "500px",
                }}
              />
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Preset
                </label>
                <select
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {sizePresets.map((preset, i) => (
                    <option key={preset.name} value={i}>
                      {preset.name}
                      {preset.width > 0 && ` (${preset.width}x${preset.height})`}
                    </option>
                  ))}
                </select>
              </div>

              {preset.name === "Custom" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width
                    </label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(parseInt(e.target.value) || 100)}
                      min="100"
                      max="4096"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height
                    </label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(parseInt(e.target.value) || 100)}
                      min="100"
                      max="4096"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormat("png")}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      format === "png"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => setFormat("jpeg")}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      format === "jpeg"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    JPEG
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Output: {width} x {height} pixels
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={randomize} className="flex-1">
              <CasinoIcon style={{ fontSize: 18 }} />
              Randomize
            </Button>
            <Button variant="primary" onClick={download} className="flex-1">
              <DownloadIcon style={{ fontSize: 18 }} />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
