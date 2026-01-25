import easyMeshGradient from "easy-mesh-gradient";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Transitioner from "../../components/Transitioner";
import { Card, Button, CodeBlock } from "../../components/ui";
import CasinoIcon from "@mui/icons-material/CasinoOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CodeIcon from "@mui/icons-material/Code";
import SpeedIcon from "@mui/icons-material/Speed";
import TuneIcon from "@mui/icons-material/Tune";
import GridViewIcon from "@mui/icons-material/GridView";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SyncIcon from "@mui/icons-material/Sync";
import libPkg from "../../../../lib/package.json";

const features = [
  {
    icon: CodeIcon,
    title: "Zero Dependencies",
    description: "Lightweight library with no external dependencies for minimal bundle size.",
  },
  {
    icon: SpeedIcon,
    title: "TypeScript Support",
    description: "Full type definitions for great developer experience and code completion.",
  },
  {
    icon: TuneIcon,
    title: "9 Easing Functions",
    description: "Built-in easing options from linear to exponential for smooth transitions.",
  },
  {
    icon: SyncIcon,
    title: "Seeded Generation",
    description: "Reproducible gradients with seed-based random generation.",
  },
  {
    icon: GridViewIcon,
    title: "Grid Generator",
    description: "Create structured patterns with the grid-based point generator.",
  },
  {
    icon: CheckCircleIcon,
    title: "Input Validation",
    description: "Automatic value clamping and normalization for safe usage.",
  },
];

const tools = [
  {
    path: "/editor",
    title: "Gradient Editor",
    description: "Create custom gradients visually with drag-and-drop points.",
  },
  {
    path: "/tools/easing",
    title: "Easing Visualizer",
    description: "Explore and compare all available easing functions.",
  },
  {
    path: "/tools/export",
    title: "Image Export",
    description: "Download gradients as PNG or JPEG images.",
  },
  {
    path: "/tools/palette",
    title: "Color Palette",
    description: "Extract colors and CSS variables from gradients.",
  },
];

const quickStartCode = `import easyMeshGradient from "easy-mesh-gradient";

// Generate a random gradient
const gradient = easyMeshGradient();

// Apply to an element
document.body.style.backgroundImage = gradient;`;

export const HomePage = function () {
  const [state, setState] = useState<{ history: string[]; current: number }>({
    history: [(Math.random() + 1).toString(36)],
    current: 0,
  });

  const backgroundImage = useMemo(
    () => easyMeshGradient({ seed: state.history[state.current] }),
    [state]
  );

  const canGoBack = state.current > 0;
  const canGoForward = state.current < state.history.length - 1;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight mb-4">
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage }}
              >
                Easy Mesh Gradient
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
              Beautiful CSS mesh gradients with zero dependencies
            </p>
            <p className="text-sm text-gray-400">v{libPkg.version}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2.5">
              <code className="text-sm text-gray-700">
                npm install easy-mesh-gradient
              </code>
            </div>
            <Link to="/editor">
              <Button variant="primary">
                Open Editor
                <ArrowForwardRoundedIcon style={{ fontSize: 18 }} />
              </Button>
            </Link>
          </div>

          {/* Gradient Preview */}
          <div className="max-w-4xl mx-auto">
            <div className="pb-[56.25%] relative rounded-3xl overflow-hidden shadow-2xl">
              <Transitioner seed={state.history[state.current]}>
                <div
                  className="absolute inset-0"
                  style={{ backgroundImage }}
                />
              </Transitioner>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setState((x) => ({ ...x, current: x.current - 1 }))}
                disabled={!canGoBack}
                className={!canGoBack ? "opacity-40" : ""}
              >
                <ArrowBackIcon style={{ fontSize: 18 }} />
              </Button>
              <Button
                variant="secondary"
                onClick={() => setState((x) => ({ ...x, current: x.current + 1 }))}
                disabled={!canGoForward}
                className={!canGoForward ? "opacity-40" : ""}
              >
                <ArrowForwardIcon style={{ fontSize: 18 }} />
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setState((x) => ({
                    history: [
                      ...x.history.slice(0, x.current + 1),
                      (Math.random() + 1).toString(36),
                    ],
                    current: x.current + 1,
                  }));
                }}
              >
                <CasinoIcon style={{ fontSize: 18 }} />
                Randomize
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create stunning gradient backgrounds
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} hover className="bg-white">
                <feature.icon
                  className="text-gray-400 mb-4"
                  style={{ fontSize: 28 }}
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                Quick Start
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Get started in seconds. Install the package, import the function,
                and apply the gradient to any element.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/sFrady20/easy-mesh-gradient/blob/main/lib/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary">View Documentation</Button>
                </a>
                <a
                  href="https://www.npmjs.com/package/easy-mesh-gradient"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost">NPM Package</Button>
                </a>
              </div>
            </div>
            <div>
              <CodeBlock code={quickStartCode} />
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Tools</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Interactive tools to help you create and customize gradients
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link key={tool.path} to={tool.path}>
                <Card
                  hover
                  className="h-full bg-white group cursor-pointer"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                    Open tool
                    <ArrowForwardRoundedIcon
                      style={{ fontSize: 16 }}
                      className="ml-1"
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
