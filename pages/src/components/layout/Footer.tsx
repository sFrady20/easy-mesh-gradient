import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-2">
              Easy Mesh Gradient
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              A lightweight, zero-dependency library for generating beautiful
              CSS mesh gradients with TypeScript support.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Tools</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/editor"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Gradient Editor
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/easing"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Easing Visualizer
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/export"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Image Export
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/palette"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Color Palette
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.npmjs.com/package/easy-mesh-gradient"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  NPM Package
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sFrady20/easy-mesh-gradient"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sFrady20/easy-mesh-gradient/blob/main/lib/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Created by{" "}
            <a
              href="https://stevenfrady.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Steven Frady
            </a>
          </p>
          <p className="text-sm text-gray-500">MIT License</p>
        </div>
      </div>
    </footer>
  );
}
