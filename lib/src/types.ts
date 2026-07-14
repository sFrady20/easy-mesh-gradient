/**
 * A point in the mesh gradient that defines a color and position.
 *
 * @public
 */
export type Point = {
  /** X coordinate as a decimal between 0 and 1 (0 = left, 1 = right) */
  x: number;
  /** Y coordinate as a decimal between 0 and 1 (0 = top, 1 = bottom) */
  y: number;
  /** Hue value between 0 and 360 */
  h: number;
  /** Saturation value between 0 and 1 */
  s: number;
  /** Lightness value between 0 and 1 */
  l: number;
  /** Scale factor controlling the size of the gradient fade around the point */
  scale: number;
};

/**
 * Easing function type that maps [0, 1] to [0, 1].
 *
 * @public
 */
export type EasingFunction = (x: number) => number;

/**
 * Shape of each point's radial gradient.
 *
 * `"circle"` (the default) keeps every blob round regardless of the
 * element's proportions. `"ellipse"` stretches with the element, matching
 * the CSS `radial-gradient` default.
 *
 * @public
 */
export type GradientShape = "circle" | "ellipse";

/**
 * Options for the gradient's rendered shape.
 *
 * @public
 */
export type ShapeOptions = {
  /**
   * Shape of each point's radial gradient.
   * @default "circle"
   */
  shape?: GradientShape;
};

/**
 * Options for controlling easing behavior in gradient transitions.
 *
 * @public
 */
export type EasingOptions = {
  /**
   * Easing function that controls the transition curve.
   * Accepts a value between 0 and 1, returns a value between 0 and 1.
   * @default easeInOutCubic
   */
  easing?: EasingFunction;
  /**
   * Number of intermediate color stops in the gradient transitions.
   * Higher values create smoother gradients but increase CSS size.
   * @default 10
   * @minimum 2
   */
  easingStops?: number;
};

/**
 * Options for generating random points.
 *
 * @public
 */
export type PointGenerationOptions = {
  /**
   * Seed string for reproducible random point generation.
   * Same seed will always generate the same points.
   */
  seed?: string;
  /**
   * Number of points to generate.
   * @default 5
   * @minimum 1
   */
  pointCount?: number;
  /**
   * Range [min, max] for the scale property of generated points.
   * @default [0.5, 2]
   */
  scaleRange?: [number, number];
  /**
   * Range [min, max] for the hue property of generated points (0-360).
   * A range where min > max wraps around the color wheel (e.g. [300, 60]).
   * @default [0, 360]
   */
  hueRange?: [number, number];
  /**
   * Range [min, max] for the saturation property of generated points (0-1).
   * @default [0.5, 1]
   */
  saturationRange?: [number, number];
  /**
   * Range [min, max] for the lightness property of generated points (0-1).
   * @default [0.5, 1]
   */
  lightnessRange?: [number, number];
  /**
   * Custom function to generate points.
   * If not provided, uses the default generator.
   */
  pointsGenerator?: (options?: PointGenerationOptions) => Point[];
};

/**
 * Options for creating a mesh gradient.
 * Either provide explicit points or options for generating them.
 *
 * @public
 */
export type GradientOptions = EasingOptions &
  ShapeOptions &
  ({ points: Point[] } | PointGenerationOptions);
