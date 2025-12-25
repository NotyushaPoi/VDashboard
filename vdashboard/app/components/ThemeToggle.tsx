"use client";

import { useTheme } from "next-themes";
import { useLayoutEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    // This pattern is necessary for SSR hydration with next-themes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // 确保DOM更新
    if (typeof document !== "undefined") {
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <button
      onClick={handleThemeToggle}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
      title="切换主题"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg
          className="w-5 h-5 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-orange-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l-2.071 2.072a1 1 0 001.414 1.414l2.071-2.072a1 1 0 00-1.414-1.414zM2.05 6.464L4.121 4.393a1 1 0 00-1.414-1.414L.636 5.05a1 1 0 001.414 1.414zM5.964 2.05L4.893.636A1 1 0 003.479 2.05l1.071 1.414a1 1 0 001.414-1.414zm8.72 8.72l1.414 1.414a1 1 0 001.414-1.414l-1.414-1.414a1 1 0 00-1.414 1.414zM4 11a1 1 0 100-2H2a1 1 0 100 2h2zm12-1a1 1 0 110-2h2a1 1 0 110 2h-2z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
