export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-8 sm:flex-row">
        <p className="text-sm text-gray-500">
          Created by{" "}
          <a
            href="https://stevenfrady.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 transition-colors hover:text-gray-900"
          >
            Steven Frady
          </a>{" "}
          · MIT License
        </p>
        <div className="flex items-center gap-5 text-sm text-gray-500">
          <a
            href="https://www.npmjs.com/package/easy-mesh-gradient"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-900"
          >
            npm
          </a>
          <a
            href="https://github.com/sFrady20/easy-mesh-gradient"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-900"
          >
            GitHub
          </a>
          <a
            href="https://github.com/sFrady20/easy-mesh-gradient/blob/main/lib/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-900"
          >
            Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
