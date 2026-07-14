import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import easyMeshGradient from "easy-mesh-gradient";
import { Button, Card, CodeBlock } from "../../components/ui";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  ShuffleIcon,
} from "../../components/icons";
import { useBrandStore } from "../../stores/brand";
import libPkg from "../../../../lib/package.json";

const features = [
  {
    title: "Zero dependencies",
    description:
      "Pure CSS output from a tiny library — nothing else ships with your bundle.",
  },
  {
    title: "Eased color falloff",
    description:
      "Nine built-in easing curves shape how each color fades, from linear to exponential.",
  },
  {
    title: "Seeded generation",
    description:
      "The same seed always produces the same gradient, so results are reproducible.",
  },
  {
    title: "Full TypeScript support",
    description:
      "Complete type definitions for every option, point, and helper.",
  },
  {
    title: "Image rendering",
    description:
      "Render the exact same gradient to a canvas and export it as PNG or JPEG.",
  },
  {
    title: "Color utilities",
    description:
      "Convert gradient points to hex, RGB, HSL, or OKLCH to build palettes.",
  },
];

const quickStartCode = `import easyMeshGradient from "easy-mesh-gradient";

// Generate a random gradient
const gradient = easyMeshGradient();

// Apply it to any element
document.body.style.backgroundImage = gradient;`;

/** Crossfades between gradients as the value changes. */
function GradientCrossfade({ gradient }: { gradient: string }) {
  const [layers, setLayers] = useState([{ key: 0, gradient }]);
  const counter = useRef(0);

  useEffect(() => {
    setLayers((prev) => {
      if (prev[prev.length - 1]?.gradient === gradient) return prev;
      return [...prev.slice(-1), { key: ++counter.current, gradient }];
    });
  }, [gradient]);

  return (
    <div className="absolute inset-0">
      {layers.map((layer, i) => (
        <div
          key={layer.key}
          className={`absolute inset-0 ${i > 0 ? "animate-[fade-in_0.6s_ease-out]" : ""}`}
          style={{ backgroundImage: layer.gradient }}
        />
      ))}
    </div>
  );
}

function InstallCommand() {
  const [copied, setCopied] = useState(false);
  const command = "npm install easy-mesh-gradient";

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      className="group flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-2.5 transition-colors hover:bg-gray-200/70"
    >
      <code className="font-mono text-sm text-gray-700">{command}</code>
      {copied ? (
        <CheckIcon size={14} className="text-green-600" />
      ) : (
        <CopyIcon
          size={14}
          className="text-gray-400 group-hover:text-gray-600"
        />
      )}
    </button>
  );
}

const initialSeed = (Math.random() + 1).toString(36);

export function HomePage() {
  const [state, setState] = useState<{ history: string[]; current: number }>({
    history: [initialSeed],
    current: 0,
  });

  const backgroundImage = useMemo(
    () => easyMeshGradient({ seed: state.history[state.current] }),
    [state]
  );

  // Keep the navbar logo gradient in sync with the hero
  const setBrandSeed = useBrandStore((s) => s.setSeed);
  useEffect(() => {
    setBrandSeed(state.history[state.current]);
  }, [state, setBrandSeed]);

  const canGoBack = state.current > 0;
  const canGoForward = state.current < state.history.length - 1;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-24">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-semibold tracking-tight sm:text-6xl">
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage }}
              >
                Easy Mesh Gradient
              </span>
            </h1>
            <p className="mx-auto mb-2 max-w-2xl text-xl text-gray-600">
              Beautiful CSS mesh gradients with zero dependencies
            </p>
            <p className="text-sm text-gray-400">v{libPkg.version}</p>
          </div>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <InstallCommand />
            <Link to="/editor">
              <Button variant="primary">
                Open Editor
                <ArrowRightIcon size={15} />
              </Button>
            </Link>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl pb-[56.25%] shadow-2xl">
              <GradientCrossfade gradient={backgroundImage} />
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                onClick={() =>
                  setState((x) => ({ ...x, current: x.current - 1 }))
                }
                disabled={!canGoBack}
                className={!canGoBack ? "opacity-40" : ""}
                aria-label="Previous gradient"
              >
                <ArrowLeftIcon size={15} />
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  setState((x) => ({ ...x, current: x.current + 1 }))
                }
                disabled={!canGoForward}
                className={!canGoForward ? "opacity-40" : ""}
                aria-label="Next gradient"
              >
                <ArrowRightIcon size={15} />
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  setState((x) => ({
                    history: [
                      ...x.history.slice(0, x.current + 1),
                      (Math.random() + 1).toString(36),
                    ],
                    current: x.current + 1,
                  }))
                }
              >
                <ShuffleIcon size={15} />
                Shuffle
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-semibold text-gray-900">
              Features
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Everything you need to create stunning gradient backgrounds
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} hover className="bg-white">
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-semibold text-gray-900">
                Quick Start
              </h2>
              <p className="mb-6 text-lg text-gray-600">
                Install the package, import the function, and apply the gradient
                to any element. Or design one visually in the editor and export
                it in the format you need.
              </p>
              <div className="flex gap-3">
                <Link to="/editor">
                  <Button variant="primary">Open Editor</Button>
                </Link>
                <a
                  href="https://github.com/sFrady20/easy-mesh-gradient/blob/main/lib/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary">View Documentation</Button>
                </a>
              </div>
            </div>
            <div>
              <CodeBlock code={quickStartCode} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
