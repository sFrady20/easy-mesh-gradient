import { computeStops, resolvePoints } from "./core";
import { pointToHsla } from "./colors";
import type { GradientOptions } from "./types";

/**
 * Options for the film-grain overlay applied after rendering.
 *
 * @public
 */
export type GrainOptions = {
  /**
   * Fraction of pixels that receive grain (0-1).
   * @default 0.5
   */
  density?: number;
  /**
   * Maximum luminance shift of a grained pixel (0-1).
   * @default 0.15
   */
  intensity?: number;
};

/**
 * Options for rendering a mesh gradient to a canvas.
 *
 * @public
 */
export type CanvasRenderOptions = GradientOptions & {
  /** Render width in pixels. Defaults to the canvas width. */
  width?: number;
  /** Render height in pixels. Defaults to the canvas height. */
  height?: number;
  /**
   * Overlay monochrome film grain on the rendered gradient.
   * Grain is random (not affected by `seed`).
   */
  grain?: GrainOptions;
};

/** @internal */
function applyGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  { density = 0.5, intensity = 0.15 }: GrainOptions
): void {
  if (density <= 0 || intensity <= 0) return;

  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() > density) continue;
    // Same offset per channel keeps the grain monochrome
    const offset = (Math.random() * 2 - 1) * intensity * 255;
    data[i] += offset;
    data[i + 1] += offset;
    data[i + 2] += offset;
  }
  ctx.putImageData(image, 0, 0);
}

/**
 * Renders a mesh gradient to a 2D canvas context, mirroring the CSS
 * output of `easyMeshGradient` (including farthest-corner ellipse
 * sizing). Useful for exporting gradients as images.
 *
 * @param ctx - The 2D canvas context to draw into
 * @param options - Same options as `easyMeshGradient`, plus width/height
 *
 * @example
 * ```ts
 * const canvas = document.createElement("canvas");
 * canvas.width = 1920;
 * canvas.height = 1080;
 * renderMeshGradient(canvas.getContext("2d")!, { seed: "hello" });
 * canvas.toBlob((blob) => ...);
 * ```
 *
 * @public
 */
export function renderMeshGradient(
  ctx: CanvasRenderingContext2D,
  options?: CanvasRenderOptions
): void {
  const width = options?.width ?? ctx.canvas.width;
  const height = options?.height ?? ctx.canvas.height;
  const points = resolvePoints(options);
  if (points.length === 0 || width <= 0 || height <= 0) return;

  const stops = computeStops(options?.easing, options?.easingStops);

  // Base layer: first point's color, fully opaque (mirrors the CSS
  // linear-gradient fallback layer)
  ctx.fillStyle = pointToHsla(points[0], 1);
  ctx.fillRect(0, 0, width, height);

  const circle = options?.shape !== "ellipse";

  // CSS paints the first background layer on top, so draw in reverse
  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i];
    const px = point.x * width;
    const py = point.y * height;
    const fsx = Math.max(px, width - px);
    const fsy = Math.max(py, height - py);

    if (circle) {
      // CSS circle farthest-corner: radius is the distance to the corner
      const r = Math.hypot(fsx, fsy) * point.scale;
      if (r <= 0) continue;

      const gradient = ctx.createRadialGradient(px, py, 0, px, py, r);
      for (const { progress, alpha } of stops) {
        gradient.addColorStop(progress, pointToHsla(point, alpha));
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      continue;
    }

    // CSS ellipse farthest-corner:
    // rx = farthest-side-x * sqrt(2), ry = farthest-side-y * sqrt(2)
    const rx = fsx * Math.SQRT2 * point.scale;
    const ry = fsy * Math.SQRT2 * point.scale;
    if (rx <= 0 || ry <= 0) continue;

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    for (const { progress, alpha } of stops) {
      gradient.addColorStop(progress, pointToHsla(point, alpha));
    }

    // Scale the y axis to turn the circular canvas gradient into the
    // correct ellipse, then fill the whole canvas in local coordinates
    const k = ry / rx;
    ctx.save();
    ctx.translate(px, py);
    ctx.scale(1, k);
    ctx.fillStyle = gradient;
    ctx.fillRect(-px, -py / k, width, height / k);
    ctx.restore();
  }

  if (options?.grain) {
    applyGrain(ctx, width, height, options.grain);
  }
}
