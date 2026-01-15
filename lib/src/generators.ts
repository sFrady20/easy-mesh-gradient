import type { Point, PointGenerationOptions } from "./types";
import { validateGenerationOptions } from "./validation";
import { createSeededRNG } from "./prng";

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
  const { seed, pointCount, hueRange, saturationRange, lightnessRange, scaleRange } = {
    ...validated,
    seed: options?.seed,
  };

  const rng = createSeededRNG(seed);

  const points: Point[] = [];

  for (let i = 0; i < pointCount; i++) {
    const [hueMin, hueMax] = hueRange;
    const hueSpan = hueMax >= hueMin ? hueMax - hueMin : 360 - hueMin + hueMax;

    points.push({
      x: rng(),
      y: rng(),
      h: (hueMin + rng() * hueSpan) % 360,
      s:
        rng() * (saturationRange[1] - saturationRange[0]) +
        saturationRange[0],
      l: rng() * (lightnessRange[1] - lightnessRange[0]) + lightnessRange[0],
      scale: rng() * (scaleRange[1] - scaleRange[0]) + scaleRange[0],
    });
  }

  return points;
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
  const { seed, hueRange, saturationRange, lightnessRange, scaleRange } = {
    ...validated,
    seed: options?.seed,
  };

  const rng = createSeededRNG(seed);
  const points: Point[] = [];

  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const [hueMin, hueMax] = hueRange;
      const hueSpan = hueMax >= hueMin ? hueMax - hueMin : 360 - hueMin + hueMax;

      points.push({
        x: col / (gridCols - 1 || 1),
        y: row / (gridRows - 1 || 1),
        h: (hueMin + rng() * hueSpan) % 360,
        s:
          rng() * (saturationRange[1] - saturationRange[0]) +
          saturationRange[0],
        l: rng() * (lightnessRange[1] - lightnessRange[0]) + lightnessRange[0],
        scale: rng() * (scaleRange[1] - scaleRange[0]) + scaleRange[0],
      });
    }
  }

  return points;
}
