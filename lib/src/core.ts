import { easeInOutCubic } from "./easings";
import { defaultPointsGenerator } from "./generators";
import type {
  EasingFunction,
  GradientOptions,
  Point,
  PointGenerationOptions,
} from "./types";
import { validatePoints } from "./validation";

/**
 * A single stop of a gradient layer: how far along the fade it sits
 * and how opaque the color is there.
 *
 * @internal
 */
export type GradientStop = { progress: number; alpha: number };

/**
 * Resolves gradient options into a validated list of points,
 * either from explicit points or by generating them.
 *
 * @internal
 */
export function resolvePoints(options?: GradientOptions): Point[] {
  if (options && "points" in options && Array.isArray(options.points)) {
    return validatePoints(options.points);
  }
  const generationOptions = options as PointGenerationOptions | undefined;
  const generate = generationOptions?.pointsGenerator ?? defaultPointsGenerator;
  return validatePoints(generate(generationOptions));
}

/**
 * Computes the shared list of eased alpha stops used by every point's
 * gradient layer. Alpha fades from 1 at the point to 0 at the edge.
 *
 * @internal
 */
export function computeStops(
  easing: EasingFunction = easeInOutCubic,
  easingStops: number = 10
): GradientStop[] {
  const count = Math.max(2, Math.floor(easingStops));
  return Array.from({ length: count }, (_, i) => {
    const progress = i / (count - 1);
    return { progress, alpha: easing(1 - progress) };
  });
}
