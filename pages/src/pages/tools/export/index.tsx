import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import easyMeshGradient, { defaultPointsGenerator, easeInOutCubic } from "easy-mesh-gradient";
import type { Point } from "easy-mesh-gradient/types";
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

// Convert HSL to RGB for canvas
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

// Draw gradient on canvas using the same algorithm as the library
function drawGradientOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  points: Point[],
  easingStops: number = 10
) {
  if (points.length === 0) return;

  // Draw base color from first point
  const basePoint = points[0];
  const baseRgb = hslToRgb(basePoint.h, basePoint.s, basePoint.l);
  ctx.fillStyle = `rgb(${baseRgb.join(",")})`;
  ctx.fillRect(0, 0, width, height);

  // Draw each point as a radial gradient (in reverse order, last on top)
  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i];
    const x = point.x * width;
    const y = point.y * height;
    const maxDim = Math.max(width, height);
    const radius = maxDim * point.scale;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

    // Generate color stops with easing
    for (let j = 0; j <= easingStops; j++) {
      const t = j / easingStops;
      const easedT = easeInOutCubic(t);
      const alpha = 1 - easedT;
      const rgb = hslToRgb(point.h, point.s, point.l);
      gradient.addColorStop(t, `rgba(${rgb.join(",")},${alpha})`);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

export function GradientExportPage() {
  const [seed, setSeed] = useState("export-demo");
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [isExporting, setIsExporting] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  const preset = sizePresets[selectedPreset];
  const width = preset.name === "Custom" ? customWidth : preset.width;
  const height = preset.name === "Custom" ? customHeight : preset.height;

  // Generate points from seed
  const points = useMemo(
    () => defaultPointsGenerator({ seed, pointCount: 5 }),
    [seed]
  );

  // CSS gradient for preview (used as fallback/reference)
  const gradient = useMemo(() => easyMeshGradient({ seed }), [seed]);

  const randomize = () => {
    setSeed((Math.random() + 1).toString(36));
  };

  // Track container width for responsive preview
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 48); // minus padding
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Calculate preview dimensions that maintain aspect ratio
  const aspectRatio = width / height;
  const maxPreviewHeight = 400;

  let previewWidth: number;
  let previewHeight: number;

  if (aspectRatio > containerWidth / maxPreviewHeight) {
    // Width constrained
    previewWidth = containerWidth;
    previewHeight = containerWidth / aspectRatio;
  } else {
    // Height constrained
    previewHeight = maxPreviewHeight;
    previewWidth = maxPreviewHeight * aspectRatio;
  }

  // Draw preview canvas
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to preview size (for display)
    canvas.width = previewWidth * window.devicePixelRatio;
    canvas.height = previewHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    drawGradientOnCanvas(ctx, previewWidth, previewHeight, points, 15);
  }, [points, previewWidth, previewHeight]);

  const download = useCallback(async () => {
    setIsExporting(true);

    try {
      // Create a full-resolution canvas for export
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Fill background for JPEG (no transparency)
      if (format === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }

      // Draw the gradient at full resolution
      drawGradientOnCanvas(ctx, width, height, points, 20);

      // Download
      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const quality = format === "jpeg" ? 0.92 : undefined;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsExporting(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `gradient-${seed}.${format}`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          setIsExporting(false);
        },
        mimeType,
        quality
      );
    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
    }
  }, [width, height, points, seed, format]);

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
            <div
              ref={containerRef}
              className="bg-gray-100 rounded-xl p-6 flex items-center justify-center"
              style={{ minHeight: Math.min(maxPreviewHeight + 48, previewHeight + 48) }}
            >
              <canvas
                ref={previewCanvasRef}
                className="rounded-lg shadow-xl"
                style={{
                  width: previewWidth,
                  height: previewHeight,
                }}
              />
            </div>
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
            <Button
              variant="primary"
              onClick={download}
              disabled={isExporting}
              className="flex-1"
            >
              <DownloadIcon style={{ fontSize: 18 }} />
              {isExporting ? "Exporting..." : "Download"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
