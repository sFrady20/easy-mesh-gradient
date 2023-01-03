import seedrandom from "seedrandom";
import type { Point, PointGenerationOptions } from "./types";

export function defaultPointsGenerator(options?: PointGenerationOptions) {
  const {
    seed,
    pointCount = 8,
    hueRange = [0, 360],
    saturationRange = [0.5, 0.8],
    lightnessRange = [0.4, 0.6],
    scaleRange = [0.5, 0.7],
  } = options || {};

  const rng = seed ? seedrandom(seed) : Math.random;

  const points: Point[] = [];

  for (var i = 0; i < pointCount; ++i) {
    points.push({
      x: rng(),
      y: rng(),
      h:
        (hueRange[1] > hueRange[0]
          ? rng() * (hueRange[1] - hueRange[0]) + hueRange[0]
          : rng() * (hueRange[1] + 360 - hueRange[0]) + hueRange[1]) % 360,
      s: rng() * (saturationRange[1] - saturationRange[0]) + saturationRange[0],
      l: rng() * (lightnessRange[1] - lightnessRange[0]) + lightnessRange[0],
      scale: rng() * (scaleRange[1] - scaleRange[0]) + scaleRange[0],
    });
  }

  return points;
}
