"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
  isJukeboxCommand?: boolean;
}

export function CopyButton({ text, label = "复制", isJukeboxCommand = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const textToCopy = isJukeboxCommand ? `点歌 ${text}` : text;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1 rounded text-sm font-medium transition-all ${
        copied
          ? "bg-green-500 text-white"
          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
      }`}
    >
      {copied ? "已复制 ✓" : label}
    </button>
  );
}
