import { computeStops, resolvePoints } from "./core";
import { pointToHsla } from "./colors";
import type { GradientOptions } from "./types";

/**
 * Generates a CSS mesh gradient string from points or generation options.
 *
 * The gradient is built from stacked CSS radial gradients, one per point,
 * with alpha transitions controlled by an easing function, over an opaque
 * base layer using the first point's color.
 *
 * @param options - Configuration options for the gradient
 * @returns CSS gradient string that can be used as a background-image
 *
 * @example
 * ```ts
 * // Simple usage with defaults
 * const gradient = easyMeshGradient();
 * document.body.style.backgroundImage = gradient;
 * ```
 *
 * @example
 * ```ts
 * // With custom points
 * const gradient = easyMeshGradient({
 *   points: [
 *     { x: 0.1, y: 0.1, h: 120, s: 0.8, l: 0.6, scale: 1 },
 *     { x: 0.9, y: 0.9, h: 300, s: 0.6, l: 0.4, scale: 1.5 },
 *   ],
 *   easingStops: 20,
 * });
 * ```
 *
 * @example
 * ```ts
 * // With generation options
 * const gradient = easyMeshGradient({
 *   seed: "my-gradient",
 *   pointCount: 8,
 *   hueRange: [180, 240],
 *   easingStops: 15,
 * });
 * ```
 *
 * @public
 */
function easyMeshGradient(options?: GradientOptions): string {
  const points = resolvePoints(options);
  if (points.length === 0) return "";

  const stops = computeStops(options?.easing, options?.easingStops);

  const radialGradients = points
    .map((point) => {
      const layerStops = stops
        .map(
          ({ progress, alpha }) =>
            `${pointToHsla(point, alpha)} ${(progress * point.scale * 100).toFixed(2)}%`
        )
        .join(", ");
      return `radial-gradient(at ${(point.x * 100).toFixed(2)}% ${(point.y * 100).toFixed(2)}%, ${layerStops})`;
    })
    .join(", ");

  // Opaque base layer using the first point's color
  const baseColor = pointToHsla(points[0], 1);
  return `${radialGradients}, linear-gradient(${baseColor}, ${baseColor})`;
}

export { easyMeshGradient };
export default easyMeshGradient;

export type {
  Point,
  GradientOptions,
  EasingOptions,
  PointGenerationOptions,
  EasingFunction,
} from "./types";
export { defaultPointsGenerator, gridPointsGenerator } from "./generators";
export {
  easings,
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInOutSine,
  easeInOutExpo,
} from "./easings";
export type { EasingName } from "./easings";
export { validatePoint, validatePoints } from "./validation";
export {
  hslToRgb,
  hslToHex,
  hexToHsl,
  hslToOklch,
  pointToHsla,
  pointToHsl,
  pointToHex,
  pointToRgb,
  pointToOklch,
} from "./colors";
export { renderMeshGradient } from "./canvas";
export type { CanvasRenderOptions } from "./canvas";
