import { useState } from "react";
import { CheckIcon, CopyIcon } from "../icons";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center justify-center gap-1.5
        px-3 py-1.5 rounded-lg text-sm font-medium
        transition-all duration-200 ease-out
        ${
          copied
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
        }
        ${className}
      `}
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
