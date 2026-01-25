import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  code: string;
  language?: string;
  showCopy?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  showCopy = true,
  className = "",
}: CodeBlockProps) {
  return (
    <div className={`relative group ${className}`}>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto text-sm leading-relaxed">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      {showCopy && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <CopyButton text={code} />
        </div>
      )}
    </div>
  );
}
