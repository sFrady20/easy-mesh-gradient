# Easy Mesh Gradient

![Frame 2 (2)](https://user-images.githubusercontent.com/3497863/210480494-fe5c3edf-5684-4881-8295-ea702e66e33e.png)

A lightweight, zero-dependency library for generating beautiful CSS mesh gradients with TypeScript support.

## Installation

```bash
npm install easy-mesh-gradient
```

or

```bash
yarn add easy-mesh-gradient
```

or

```bash
pnpm add easy-mesh-gradient
```

## Quick Start

```tsx
import easyMeshGradient from "easy-mesh-gradient";

// Simple usage with defaults
const gradient = easyMeshGradient();
document.body.style.backgroundImage = gradient;
```

## Usage

### Basic Usage

```tsx
import easyMeshGradient from "easy-mesh-gradient";

const gradient = easyMeshGradient();
document.body.style.backgroundImage = gradient;
```

### With Custom Points

```tsx
import easyMeshGradient from "easy-mesh-gradient";

const gradient = easyMeshGradient({
  points: [
    { x: 0.1, y: 0.1, h: 120, s: 0.8, l: 0.6, scale: 1 },
    { x: 0.5, y: 0.5, h: 60, s: 0.7, l: 0.5, scale: 1.5 },
    { x: 0.9, y: 0.9, h: 300, s: 0.6, l: 0.4, scale: 1 },
  ],
  easingStops: 20,
});

document.body.style.backgroundImage = gradient;
```

### With Generation Options

```tsx
import easyMeshGradient from "easy-mesh-gradient";

const gradient = easyMeshGradient({
  seed: "my-gradient", // Reproducible gradient
  pointCount: 8,
  hueRange: [180, 240], // Blue-green range
  saturationRange: [0.6, 0.9],
  lightnessRange: [0.4, 0.7],
  easingStops: 15,
});
```

### Using Named Exports

```tsx
import {
  easyMeshGradient,
  easeInOutSine,
  gridPointsGenerator,
  validatePoint,
} from "easy-mesh-gradient";

// Use different easing
const gradient = easyMeshGradient({
  easing: easeInOutSine,
  pointCount: 5,
});

// Use grid generator
const gridGradient = easyMeshGradient({
  pointsGenerator: (options) => gridPointsGenerator(options, 4, 4),
});
```

## API Reference

### `easyMeshGradient(options?)`

Generates a CSS mesh gradient string.

**Parameters:**

- `options` (optional): Configuration object

**Returns:** `string` - CSS gradient string

### Options

#### `points?: Point[]`

An array of points that define the mesh gradient. Each point has:

- `x`: X coordinate (0-1, where 0 = left, 1 = right)
- `y`: Y coordinate (0-1, where 0 = top, 1 = bottom)
- `h`: Hue (0-360)
- `s`: Saturation (0-1)
- `l`: Lightness (0-1)
- `scale`: Scale factor for gradient fade size (≥ 0.1)

If not provided, points will be generated automatically.

#### `easing?: (x: number) => number`

Easing function for gradient transitions. Accepts 0-1, returns 0-1.

**Available easing functions:**
- `linear` - No acceleration
- `easeInQuad`, `easeOutQuad`, `easeInOutQuad` - Quadratic easing
- `easeInCubic`, `easeOutCubic`, `easeInOutCubic` - Cubic easing (default)
- `easeInOutSine` - Smooth sine curve
- `easeInOutExpo` - Exponential curve

**Default:** `easeInOutCubic`

#### `easingStops?: number`

Number of intermediate color stops (minimum 2). Higher = smoother but larger CSS.

**Default:** `10`

#### `seed?: string`

Seed for reproducible random point generation. Same seed = same gradient.

#### `pointCount?: number`

Number of points to generate (minimum 1).

**Default:** `5`

#### `scaleRange?: [number, number]`

Min/max scale values for generated points.

**Default:** `[0.5, 2]`

#### `hueRange?: [number, number]`

Min/max hue values (0-360) for generated points.

**Default:** `[0, 360]`

#### `saturationRange?: [number, number]`

Min/max saturation values (0-1) for generated points.

**Default:** `[0.5, 1]`

#### `lightnessRange?: [number, number]`

Min/max lightness values (0-1) for generated points.

**Default:** `[0.5, 1]`

#### `pointsGenerator?: (options?) => Point[]`

Custom function to generate points. Use `defaultPointsGenerator` or `gridPointsGenerator`.

## Advanced Usage

### Available Exports

```tsx
import {
  // Main function
  easyMeshGradient,
  
  // Easing functions
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInOutSine,
  easeInOutExpo,
  
  // Point generators
  defaultPointsGenerator,
  gridPointsGenerator,
  
  // Validation utilities
  validatePoint,
  validatePoints,
  
  // Types
  type Point,
  type GradientOptions,
  type EasingFunction,
} from "easy-mesh-gradient";
```

### Grid Pattern Generator

```tsx
import { easyMeshGradient, gridPointsGenerator } from "easy-mesh-gradient";

const gradient = easyMeshGradient({
  pointsGenerator: (options) => gridPointsGenerator(options, 4, 4), // 4x4 grid
});
```

### Custom Easing

```tsx
import { easyMeshGradient, easeInOutSine } from "easy-mesh-gradient";

const gradient = easyMeshGradient({
  easing: easeInOutSine,
  pointCount: 8,
});
```

### Input Validation

```tsx
import { validatePoint, validatePoints } from "easy-mesh-gradient";

// Validate and normalize a single point
const validPoint = validatePoint({
  x: 1.5, // Will be clamped to 1
  y: -0.1, // Will be clamped to 0
  h: 400, // Will be clamped to 360
  s: 0.8,
  l: 0.6,
  scale: 0.05, // Will be set to minimum 0.1
});

// Validate an array of points
const validPoints = validatePoints([
  { x: 0.5, y: 0.5, h: 120, s: 0.8, l: 0.6, scale: 1 },
  { x: 1.2, y: -0.1, h: 240, s: 0.7, l: 0.5, scale: 1.5 },
]);
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type { Point, GradientOptions, EasingFunction } from "easy-mesh-gradient";

const customEasing: EasingFunction = (x) => x * x;
const points: Point[] = [
  { x: 0.5, y: 0.5, h: 180, s: 0.8, l: 0.6, scale: 1 },
];
const options: GradientOptions = {
  points,
  easing: customEasing,
  easingStops: 15,
};
```

## Examples

### React Component

```tsx
import { useEffect, useState } from "react";
import easyMeshGradient from "easy-mesh-gradient";

function GradientBackground() {
  const [gradient, setGradient] = useState("");

  useEffect(() => {
    setGradient(
      easyMeshGradient({
        seed: "my-app-gradient",
        pointCount: 6,
        hueRange: [200, 280],
      })
    );
  }, []);

  return (
    <div
      style={{
        backgroundImage: gradient,
        width: "100%",
        height: "100vh",
      }}
    />
  );
}
```

### Reproducible Gradients

```tsx
// Same seed always produces the same gradient
const gradient1 = easyMeshGradient({ seed: "consistent", pointCount: 5 });
const gradient2 = easyMeshGradient({ seed: "consistent", pointCount: 5 });
// gradient1 === gradient2
```

### Performance Tips

- Lower `easingStops` (5-10) for better performance
- Use `seed` to cache gradients instead of regenerating
- Prefer explicit `points` over generation for critical paths

## Features

- ✨ **Zero dependencies** (except seedrandom for reproducible randomness)
- 📦 **Tree-shakeable** - Import only what you need
- 🎨 **Multiple easing functions** - 9 built-in easing options
- 🔧 **Fully typed** - Complete TypeScript support
- ✅ **Input validation** - Automatic value clamping and normalization
- 🎲 **Reproducible** - Seed-based generation for consistent gradients
- 🚀 **Lightweight** - Minimal bundle size
- 🎯 **Flexible** - Use custom points or auto-generation

## License

MIT
