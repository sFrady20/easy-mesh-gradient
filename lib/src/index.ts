import { easeInOutCubic } from "./easings";
import { defaultPointsGenerator } from "./generators";
import type { GradientOptions, Point, PointGenerationOptions } from "./types";
import { validatePoints } from "./validation";

/**
 * Generates a CSS mesh gradient string from points or generation options.
 *
 * The function creates a beautiful mesh gradient using CSS radial gradients
 * positioned at specific points with color transitions controlled by easing functions.
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
  const { easing = easeInOutCubic, easingStops = 10 } = options || {};

  // Validate easingStops
  const stops = Math.max(2, Math.floor(easingStops));

  let points: Point[] = [];

  // Determine if we're using explicit points or generating them
  if (options && "points" in options && Array.isArray(options.points)) {
    points = validatePoints(options.points);
  } else {
    const generationOptions = options as PointGenerationOptions | undefined;
    const { pointsGenerator = defaultPointsGenerator } = generationOptions || {};
    const generated = pointsGenerator(generationOptions);
    points = validatePoints(generated);
  }

  // Return empty string if no valid points
  if (points.length === 0) {
    return "";
  }

  // Use first point as background color
  const bg = points[0];

  // Generate gradient stops for each point
  const gradientStops = Array.from({ length: stops }, (_, i) => {
    const progress = i / (stops - 1);
    return progress;
  });

  // Build radial gradients for each point
  const radialGradients = points
    .map((pt) => {
      const stops = gradientStops
        .map((progress) => {
          const alpha = easing(1 - progress);
          const position = progress * pt.scale * 100;
          return `hsla(${Math.round(pt.h % 360)}, ${Math.round(pt.s * 100)}%, ${Math.round(pt.l * 100)}%, ${alpha.toFixed(3)}) ${position.toFixed(2)}%`;
        })
        .join(", ");

      return `radial-gradient(at ${(pt.x * 100).toFixed(2)}% ${(pt.y * 100).toFixed(2)}%, ${stops})`;
    })
    .join(", ");

  // Add base linear gradient for fallback
  const bgColor = `hsla(${Math.round(bg.h % 360)}, ${Math.round(bg.s * 100)}%, ${Math.round(bg.l * 100)}%, 1)`;
  const linearGradient = `linear-gradient(${bgColor}, ${bgColor})`;

  return `${radialGradients}, ${linearGradient}`;
}

// Named export for better tree-shaking and explicit imports
export { easyMeshGradient };

// Default export for backward compatibility
export default easyMeshGradient;

// Re-export types and utilities for advanced usage
export type { Point, GradientOptions, EasingOptions, PointGenerationOptions, EasingFunction } from "./types";
export { defaultPointsGenerator, gridPointsGenerator } from "./generators";
export {
  easeInOutCubic,
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutSine,
  easeInOutExpo,
} from "./easings";
export { validatePoint, validatePoints } from "./validation";
