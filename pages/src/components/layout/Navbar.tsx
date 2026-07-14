import { useMemo } from "react";
import { Link, useLocation } from "react-router";
import easyMeshGradient from "easy-mesh-gradient";
import { GitHubIcon } from "../icons";
import { useBrandStore } from "../../stores/brand";

export function Navbar() {
  const location = useLocation();
  const inEditor = location.pathname === "/editor";

  // Follows the home page hero: shuffling there re-seeds the logo too
  const seed = useBrandStore((s) => s.seed);
  const logoGradient = useMemo(() => easyMeshGradient({ seed }), [seed]);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span
            key={seed}
            className="h-4 w-4 rounded-full shadow-sm animate-[pop_0.5s_var(--ease-spring)]"
            style={{ backgroundImage: logoGradient }}
          />
          <span className="text-[15px] font-semibold tracking-tight text-gray-900">
            Easy Mesh Gradient
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/editor"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              inEditor
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Editor
          </Link>
          <a
            href="https://github.com/sFrady20/easy-mesh-gradient"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            aria-label="GitHub Repository"
          >
            <GitHubIcon size={18} />
          </a>
        </div>
      </div>
    </nav>
  );
}
