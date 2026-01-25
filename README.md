# Easy Mesh Gradient

![Frame 2 (2)](https://user-images.githubusercontent.com/3497863/210480494-fe5c3edf-5684-4881-8295-ea702e66e33e.png)

A lightweight, zero-dependency library for generating beautiful CSS mesh gradients with TypeScript support.

## Documentation

For complete documentation, API reference, and examples, see the **[Library Documentation](./lib/README.md)**.

## Quick Links

- [NPM Package](https://www.npmjs.com/package/easy-mesh-gradient)
- [Live Demo & Editor](https://sfrady20.github.io/easy-mesh-gradient)
- [API Documentation](./lib/README.md)

## Quick Start

```bash
npm install easy-mesh-gradient
```

```tsx
import easyMeshGradient from "easy-mesh-gradient";

const gradient = easyMeshGradient();
document.body.style.backgroundImage = gradient;
```

## Repository Structure

This is a monorepo containing:

- **`lib/`** - The easy-mesh-gradient npm package ([documentation](./lib/README.md))
- **`pages/`** - The documentation website with interactive tools

## Development

```bash
# Install dependencies
bun install

# Run the development server
bun run dev

# Build the library
bun run build
```

## Features

- Zero dependencies
- Full TypeScript support
- 9 built-in easing functions
- Seeded random generation for reproducible gradients
- Grid pattern generator
- Input validation and normalization
- Tree-shakeable exports

## License

MIT

---

Created by [Steven Frady](https://stevenfrady.com)
