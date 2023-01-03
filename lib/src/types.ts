export type Point = {
  x: number;
  y: number;
  h: number;
  s: number;
  l: number;
  scale: number;
};

export type EasingOptions = {
  easing?: (x: number) => number;
  easingStops?: number;
};

export type PointGenerationOptions = {
  seed?: string;
  pointCount?: number;
  scaleRange?: [number, number];
  hueRange?: [number, number];
  saturationRange?: [number, number];
  lightnessRange?: [number, number];
  pointsGenerator?: (options?: PointGenerationOptions) => Point[];
};

export type GradientOptions = EasingOptions &
  ({ points: Point[] } | PointGenerationOptions);
