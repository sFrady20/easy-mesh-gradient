import type { Point, PointGenerationOptions } from "./types";
import { validateGenerationOptions } from "./validation";
import { createSeededRNG } from "./prng";

/** @internal */
function randomInRange(rng: () => number, [min, max]: [number, number]) {
  return min + rng() * (max - min);
}

/** Builds the color and scale of a point from validated ranges. @internal */
function randomPointStyle(
  rng: () => number,
  options: ReturnType<typeof validateGenerationOptions>
) {
  const [hueMin, hueMax] = options.hueRange;
  // A min > max hue range wraps around the color wheel
  const hueSpan = hueMax >= hueMin ? hueMax - hueMin : 360 - hueMin + hueMax;

  return {
    h: (hueMin + rng() * hueSpan) % 360,
    s: randomInRange(rng, options.saturationRange),
    l: randomInRange(rng, options.lightnessRange),
    scale: randomInRange(rng, options.scaleRange),
  };
}

/**
 * Generates random points for a mesh gradient.
 * Uses validated options to ensure all values are within valid ranges.
 *
 * @param options - Options for point generation
 * @returns Array of generated points
 * @public
 */
export function defaultPointsGenerator(
  options?: PointGenerationOptions
): Point[] {
  const validated = validateGenerationOptions(options);
  const rng = createSeededRNG(options?.seed);

  return Array.from({ length: validated.pointCount }, () => ({
    x: rng(),
    y: rng(),
    ...randomPointStyle(rng, validated),
  }));
}

/**
 * Generates points in a grid pattern for more structured gradients.
 *
 * @param options - Options for grid generation
 * @param gridCols - Number of columns in the grid (default: 3)
 * @param gridRows - Number of rows in the grid (default: 3)
 * @returns Array of points arranged in a grid
 * @public
 */
export function gridPointsGenerator(
  options?: PointGenerationOptions,
  gridCols: number = 3,
  gridRows: number = 3
): Point[] {
  const validated = validateGenerationOptions(options);
  const rng = createSeededRNG(options?.seed);
  const points: Point[] = [];

  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      points.push({
        x: col / (gridCols - 1 || 1),
        y: row / (gridRows - 1 || 1),
        ...randomPointStyle(rng, validated),
      });
    }
  }

  return points;
}
