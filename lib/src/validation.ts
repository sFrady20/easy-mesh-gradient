import type { Point, PointGenerationOptions } from "./types";

/** @internal */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** @internal */
function normalizeRange(
  range: unknown,
  fallback: [number, number],
  min: number,
  max: number
): [number, number] {
  if (!Array.isArray(range)) return fallback;
  const lo = clamp(Number(range[0] ?? fallback[0]), min, max);
  const hi = clamp(Number(range[1] ?? fallback[1]), min, max);
  return lo <= hi ? [lo, hi] : [hi, lo];
}

/**
 * Validates and normalizes a Point object.
 * Clamps values to valid ranges and ensures all properties are numbers.
 *
 * @param point - The point to validate
 * @returns A normalized point with clamped values
 * @public
 */
export function validatePoint(point: Partial<Point>): Point {
  return {
    x: clamp(Number(point.x ?? 0.5), 0, 1),
    y: clamp(Number(point.y ?? 0.5), 0, 1),
    h: clamp(Number(point.h ?? 0), 0, 360),
    s: clamp(Number(point.s ?? 0.5), 0, 1),
    l: clamp(Number(point.l ?? 0.5), 0, 1),
    scale: Math.max(Number(point.scale ?? 1), 0.1),
  };
}

/**
 * Validates and normalizes an array of points.
 *
 * @param points - Array of points to validate
 * @returns Array of normalized points
 * @public
 */
export function validatePoints(points: Partial<Point>[]): Point[] {
  if (!Array.isArray(points)) return [];
  return points.map(validatePoint);
}

/**
 * Validates point generation options and returns normalized values.
 *
 * The hue range is intentionally not reordered: [300, 60] wraps
 * around the color wheel.
 *
 * @param options - Options to validate
 * @returns Normalized options with valid ranges
 * @internal
 */
export function validateGenerationOptions(
  options?: PointGenerationOptions
): Required<Omit<PointGenerationOptions, "seed" | "pointsGenerator">> {
  const hueRange: [number, number] = Array.isArray(options?.hueRange)
    ? [
        clamp(Number(options.hueRange[0] ?? 0), 0, 360),
        clamp(Number(options.hueRange[1] ?? 360), 0, 360),
      ]
    : [0, 360];

  return {
    pointCount: Math.max(1, Math.floor(Number(options?.pointCount ?? 5))),
    scaleRange: normalizeRange(options?.scaleRange, [0.5, 2], 0.1, Infinity),
    hueRange,
    saturationRange: normalizeRange(options?.saturationRange, [0.5, 1], 0, 1),
    lightnessRange: normalizeRange(options?.lightnessRange, [0.5, 1], 0, 1),
  };
}
