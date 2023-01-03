import { easeInOutCubic } from "./easings";
import { defaultPointsGenerator } from "./generators";
import type { GradientOptions, Point } from "./types";

const easyMeshGradient = (options?: GradientOptions) => {
  const { easing = easeInOutCubic, easingStops = 10 } = options || {};

  let points: Point[] = [];
  if (options && "points" in options) {
    points = [...points];
  } else {
    const { pointsGenerator = defaultPointsGenerator } = options || {};
    points = pointsGenerator(options);
  }
  const bg = points[0];

  const image = `${points.map(
    (pt) =>
      `radial-gradient(at ${pt.x * 100}% ${pt.y * 100}%, ${[
        ...Array(easingStops),
      ]
        .map((_, x) => x / (easingStops - 1))
        .map(
          (x) =>
            `hsla(${pt.h % 360}, ${pt.s * 100}%, ${pt.l * 100}%, ${easing(
              1 - x
            )}) ${x * pt.scale * 100}%`
        )
        .join(", ")})`
  )}, linear-gradient(hsla(${bg.h % 360}, ${bg.s * 100}%, ${
    bg.l * 100
  }%, 1), hsla(${bg.h % 360}, ${bg.s * 100}%, ${bg.l * 100}%, 1))`;

  return image;
};

export default easyMeshGradient;
