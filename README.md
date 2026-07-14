# Easy Mesh Gradient

![Frame 2 (2)](https://user-images.githubusercontent.com/3497863/210480494-fe5c3edf-5684-4881-8295-ea702e66e33e.png)

A lightweight, zero-dependency library for generating beautiful CSS mesh gradients with TypeScript support.

## Quick Links

- [NPM Package](https://www.npmjs.com/package/easy-mesh-gradient)
- [Live Editor](https://easy-mesh-gradient.stevenfrady.com)
- [Library Documentation](./lib/README.md)

## Quick Start

```bash
npm install easy-mesh-gradient
```

```ts
import easyMeshGradient from "easy-mesh-gradient";

const gradient = easyMeshGradient();
document.body.style.backgroundImage = gradient;
```

## Repository Structure

This is a Bun workspace monorepo containing:

- **`lib/`** — the `easy-mesh-gradient` npm package ([documentation](./lib/README.md))
- **`pages/`** — the website: a landing page and a visual gradient editor with multi-format export
- **`promo/`** — a promo video built with [Remotion](https://www.remotion.dev)

## Development

```bash
# Install dependencies (all workspaces)
bun install

# Run the website dev server (bundles the library from source with HMR)
bun run dev

# Build the library
bun run build

# Build the website
bun run build:pages

# Lint and type-check
bun run lint
bun run type-check
```

The website aliases `easy-mesh-gradient` to `lib/src`, so library changes hot-reload in the site during development.

## Releases

- **Website** — deployed to GitHub Pages automatically on pushes to `main` that touch `pages/` or the library source ([workflow](./.github/workflows/deploy-pages.yml)).
- **npm package** — published automatically when a GitHub release is published ([workflow](./.github/workflows/publish.yml)). Auth uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC, no token secret) — the package on npmjs.com is configured to trust this repo's `publish.yml` workflow, and provenance is generated automatically. Bump `lib/package.json`'s version before releasing.

## License

MIT

---

Created by [Steven Frady](https://stevenfrady.com)
