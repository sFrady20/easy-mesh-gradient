import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/editor", label: "Editor" },
  { path: "/tools/easing", label: "Easing" },
  { path: "/tools/export", label: "Export" },
  { path: "/tools/palette", label: "Palette" },
];

// Hardcoded accessible gradient for the title
const titleGradient =
  "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)";

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <span
            className="font-semibold text-lg tracking-tight bg-clip-text text-transparent"
            style={{ backgroundImage: titleGradient }}
          >
            Easy Mesh Gradient
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                  ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <a
            href="https://github.com/sFrady20/easy-mesh-gradient"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-150"
            aria-label="GitHub Repository"
          >
            <GitHubIcon style={{ fontSize: 20 }} />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <CloseIcon style={{ fontSize: 24 }} />
          ) : (
            <MenuIcon style={{ fontSize: 24 }} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150
                    ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href="https://github.com/sFrady20/easy-mesh-gradient"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-150"
            >
              <GitHubIcon style={{ fontSize: 20 }} />
              GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
