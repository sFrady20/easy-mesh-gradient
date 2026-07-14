# Easy Mesh Gradient

![Frame 2 (2)](https://user-images.githubusercontent.com/3497863/210480494-fe5c3edf-5684-4881-8295-ea702e66e33e.png)

A lightweight, zero-dependency library for generating beautiful CSS mesh gradients with TypeScript support.

Try it visually in the [live editor](https://easy-mesh-gradient.stevenfrady.com).

## Installation

```bash
npm install easy-mesh-gradient
```

## Quick Start

```ts
import easyMeshGradient from "easy-mesh-gradient";

// Simple usage with defaults
const gradient = easyMeshGradient();
document.body.style.backgroundImage = gradient;
```

### With React

The library is framework-independent — it just returns a CSS string — so in React it's one line of style:

```tsx
import { useMemo } from "react";
import easyMeshGradient from "easy-mesh-gradient";

function Hero({ seed }: { seed: string }) {
  const backgroundImage = useMemo(() => easyMeshGradient({ seed }), [seed]);
  return <div style={{ backgroundImage }}>…</div>;
}
```

Memoize (or generate outside the component) so the gradient isn't rebuilt on every render.

## Usage

### With Generation Options

```ts
import easyMeshGradient from "easy-mesh-gradient";

const gradient = easyMeshGradient({
  seed: "my-gradient", // reproducible output
  pointCount: 8,
  hueRange: [180, 240], // blues only
  saturationRange: [0.6, 1],
  lightnessRange: [0.4, 0.7],
  scaleRange: [0.5, 1.5],
});
```

### With Custom Points

```ts
import easyMeshGradient from "easy-mesh-gradient";

const gradient = easyMeshGradient({
  points: [
    { x: 0.1, y: 0.1, h: 120, s: 0.8, l: 0.6, scale: 1 },
    { x: 0.9, y: 0.9, h: 300, s: 0.6, l: 0.4, scale: 1.5 },
  ],
  easingStops: 20,
});
```

### With a Custom Easing

```ts
import easyMeshGradient, { easeInOutExpo } from "easy-mesh-gradient";

const gradient = easyMeshGradient({
  easing: easeInOutExpo,
  easingStops: 15,
});

// Or any (x: number) => number mapping [0, 1] to [0, 1]
const custom = easyMeshGradient({ easing: (x) => x * x });
```

## API Reference

### `easyMeshGradient(options?)`

Returns a CSS gradient string (stacked `radial-gradient`s over an opaque base layer) for use as a `background-image`. The first point paints on top and sets the base color.

Blobs are circles by default, so the gradient looks right on any element — wide banners included. Pass `shape: "ellipse"` if you want the blobs to stretch with the element's proportions instead.

### Options

All options are optional.

| Option            | Type                    | Default          | Description                                                                 |
| ----------------- | ----------------------- | ---------------- | --------------------------------------------------------------------------- |
| `points`          | `Point[]`               | generated        | Explicit points. When provided, generation options are ignored.             |
| `shape`           | `"circle" \| "ellipse"` | `"circle"`       | Blob shape. Circles stay round on any element; ellipses stretch with it.    |
| `easing`          | `(x: number) => number` | `easeInOutCubic` | Controls the alpha falloff curve of each point.                             |
| `easingStops`     | `number`                | `10`             | Number of color stops per point (min 2). More stops = smoother, longer CSS. |
| `seed`            | `string`                | random           | Seed for reproducible generation. Same seed, same gradient.                 |
| `pointCount`      | `number`                | `5`              | Number of points to generate (min 1).                                       |
| `hueRange`        | `[number, number]`      | `[0, 360]`       | Hue range. `min > max` wraps around the color wheel (e.g. `[300, 60]`).     |
| `saturationRange` | `[number, number]`      | `[0.5, 1]`       | Saturation range (0–1).                                                     |
| `lightnessRange`  | `[number, number]`      | `[0.5, 1]`       | Lightness range (0–1).                                                      |
| `scaleRange`      | `[number, number]`      | `[0.5, 2]`       | Range for each point's fade size.                                           |
| `pointsGenerator` | `(options?) => Point[]` | scatter          | Custom point generation function.                                           |

### `Point`

```ts
type Point = {
  x: number; // 0-1, left to right
  y: number; // 0-1, top to bottom
  h: number; // hue, 0-360
  s: number; // saturation, 0-1
  l: number; // lightness, 0-1
  scale: number; // fade size multiplier
};
```

## Exports

Everything is exported from the package root:

```ts
import easyMeshGradient, {
  // Generators
  defaultPointsGenerator,
  gridPointsGenerator,

  // Easings
  easings, // Record<EasingName, EasingFunction>
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInOutSine,
  easeInOutExpo,

  // Validation
  validatePoint,
  validatePoints,

  // Color utilities
  hslToRgb,
  hslToHex,
  hexToHsl,
  hslToOklch,
  pointToHsla,
  pointToHsl,
  pointToHex,
  pointToRgb,
  pointToOklch,

  // Canvas rendering
  renderMeshGradient,
} from "easy-mesh-gradient";

import type {
  Point,
  GradientOptions,
  EasingOptions,
  ShapeOptions,
  GradientShape,
  PointGenerationOptions,
  EasingFunction,
  EasingName,
  CanvasRenderOptions,
  GrainOptions,
} from "easy-mesh-gradient";
```

## Advanced Usage

### Grid Pattern Generator

```ts
import easyMeshGradient, { gridPointsGenerator } from "easy-mesh-gradient";

// 3x3 grid of points with randomized colors
const gradient = easyMeshGradient({
  pointsGenerator: (options) => gridPointsGenerator(options, 3, 3),
  seed: "structured",
});
```

### Rendering to Canvas (image export)

`renderMeshGradient` draws the exact same gradient onto a 2D canvas context, which makes PNG/JPEG export easy:

```ts
import { renderMeshGradient } from "easy-mesh-gradient";

const canvas = document.createElement("canvas");
canvas.width = 1920;
canvas.height = 1080;

renderMeshGradient(canvas.getContext("2d")!, { seed: "wallpaper" });

canvas.toBlob((blob) => {
  // download or upload the image
}, "image/png");
```

It also supports an optional monochrome film-grain overlay:

```ts
renderMeshGradient(ctx, {
  seed: "wallpaper",
  grain: {
    density: 0.5, // fraction of pixels affected (0-1)
    intensity: 0.15, // maximum luminance shift (0-1)
  },
});
```

### Extracting a Color Palette

```ts
import {
  defaultPointsGenerator,
  pointToHex,
  pointToOklch,
} from "easy-mesh-gradient";

const points = defaultPointsGenerator({ seed: "brand", pointCount: 5 });
const hexPalette = points.map(pointToHex);
const oklchPalette = points.map(pointToOklch);
```

### Building an Easing Picker

```ts
import { easings, type EasingName } from "easy-mesh-gradient";

for (const [name, fn] of Object.entries(easings)) {
  console.log(name, fn(0.5));
}
```

### Input Validation

All inputs are validated and normalized automatically — values are clamped to valid ranges and missing properties get sensible defaults. `validatePoint` / `validatePoints` are exported if you want the same normalization for your own data.

## Examples

### Reproducible Gradients

```ts
// These are always identical
const a = easyMeshGradient({ seed: "hello" });
const b = easyMeshGradient({ seed: "hello" });
```

## Performance Tips

- Generate gradients once and reuse the string; regenerating on every render is wasted work.
- Lower `easingStops` for shorter CSS output; raise it if you see banding.
- Fewer points means fewer stacked `radial-gradient` layers for the browser to composite.

## Migrating from 0.1.x

- **Single entry point** — subpath imports (`easy-mesh-gradient/easings`, `/types`, `/generators`, `/validation`) were removed. Import everything from `"easy-mesh-gradient"`.
- **Seeded output changed** — the internal PRNG was upgraded (better distribution). The same seed produces a different (nicer) gradient than 0.1.x.
- **Blobs are circles now** — 0.1.x used the CSS default ellipse, which stretches on oblong elements. Pass `shape: "ellipse"` for the old behavior.
- **New in 0.2** — `easings` map, `EasingName` type, color utilities (`pointToHex`, `hslToOklch`, …), and `renderMeshGradient` for canvas/image export.

## License

MIT — created by [Steven Frady](https://stevenfrady.com)
