import type { Point, PointGenerationOptions } from "./types";

/**
 * Validates that a number is within a given range.
 *
 * @internal
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
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
  if (!Array.isArray(points) || points.length === 0) {
    return [];
  }
  return points.map(validatePoint);
}

/**
 * Validates point generation options and returns normalized values.
 *
 * @param options - Options to validate
 * @returns Normalized options with valid ranges
 * @internal
 */
export function validateGenerationOptions(
  options?: PointGenerationOptions
): Required<Omit<PointGenerationOptions, "seed" | "pointsGenerator">> {
  const pointCount = Math.max(1, Math.floor(Number(options?.pointCount ?? 5)));

  const scaleRange: [number, number] = Array.isArray(options?.scaleRange)
    ? [
        Math.max(0.1, options.scaleRange[0] ?? 0.5),
        Math.max(0.1, options.scaleRange[1] ?? 2),
      ]
    : [0.5, 2];

  const hueRange: [number, number] = Array.isArray(options?.hueRange)
    ? [
        clamp(options.hueRange[0] ?? 0, 0, 360),
        clamp(options.hueRange[1] ?? 360, 0, 360),
      ]
    : [0, 360];

  const saturationRange: [number, number] = Array.isArray(
    options?.saturationRange
  )
    ? [
        clamp(options.saturationRange[0] ?? 0.5, 0, 1),
        clamp(options.saturationRange[1] ?? 1, 0, 1),
      ]
    : [0.5, 1];

  const lightnessRange: [number, number] = Array.isArray(
    options?.lightnessRange
  )
    ? [
        clamp(options.lightnessRange[0] ?? 0.5, 0, 1),
        clamp(options.lightnessRange[1] ?? 1, 0, 1),
      ]
    : [0.5, 1];

  return {
    pointCount,
    scaleRange: scaleRange[0] <= scaleRange[1] ? scaleRange : [scaleRange[1], scaleRange[0]],
    hueRange: hueRange[0] <= hueRange[1] ? hueRange : [hueRange[1], hueRange[0]],
    saturationRange:
      saturationRange[0] <= saturationRange[1]
        ? saturationRange
        : [saturationRange[1], saturationRange[0]],
    lightnessRange:
      lightnessRange[0] <= lightnessRange[1]
        ? lightnessRange
        : [lightnessRange[1], lightnessRange[0]],
  };
}
