import { useState, useRef, useCallback, useMemo } from "react";
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
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const preset = sizePresets[selectedPreset];
  const width = preset.name === "Custom" ? customWidth : preset.width;
  const height = preset.name === "Custom" ? customHeight : preset.height;

  const gradient = useMemo(() => easyMeshGradient({ seed }), [seed]);

  const randomize = () => {
    setSeed((Math.random() + 1).toString(36));
  };

  const download = useCallback(async () => {
    setIsExporting(true);

    try {
      // Create an SVG with foreignObject containing the gradient div
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));
      svg.setAttribute("xmlns", svgNS);

      const foreignObject = document.createElementNS(svgNS, "foreignObject");
      foreignObject.setAttribute("width", "100%");
      foreignObject.setAttribute("height", "100%");

      const div = document.createElement("div");
      div.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
      div.style.width = "100%";
      div.style.height = "100%";
      div.style.backgroundImage = gradient;

      foreignObject.appendChild(div);
      svg.appendChild(foreignObject);

      // Serialize SVG to string
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create image from SVG
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = svgUrl;
      });

      // Draw to canvas
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

      ctx.drawImage(img, 0, 0, width, height);

      // Clean up SVG URL
      URL.revokeObjectURL(svgUrl);

      // Download
      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const quality = format === "jpeg" ? 0.92 : undefined;

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
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
  }, [width, height, gradient, seed, format]);

  // Calculate preview dimensions that fit within the container while maintaining aspect ratio
  const previewMaxWidth = 600;
  const previewMaxHeight = 400;
  const aspectRatio = width / height;

  let previewWidth: number;
  let previewHeight: number;

  if (aspectRatio > previewMaxWidth / previewMaxHeight) {
    // Width constrained
    previewWidth = Math.min(previewMaxWidth, width);
    previewHeight = previewWidth / aspectRatio;
  } else {
    // Height constrained
    previewHeight = Math.min(previewMaxHeight, height);
    previewWidth = previewHeight * aspectRatio;
  }

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
            <div className="bg-gray-100 rounded-xl p-6 flex items-center justify-center min-h-[450px]">
              <div
                ref={previewRef}
                className="rounded-lg shadow-xl"
                style={{
                  backgroundImage: gradient,
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
