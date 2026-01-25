import { Link, useLocation } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/editor", label: "Editor" },
  { path: "/tools/easing", label: "Easing" },
  { path: "/tools/export", label: "Export" },
  { path: "/tools/palette", label: "Palette" },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-semibold text-lg tracking-tight text-gray-900">
            Easy Mesh Gradient
          </span>
        </Link>

        <div className="flex items-center gap-1">
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
      </div>
    </nav>
  );
}
