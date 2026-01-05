"use client";

import { createContext, useContext, useEffect, ReactNode, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取主题
    const savedTheme = localStorage.getItem("vdashboard-theme") as Theme | null;
    const initialTheme = savedTheme || "light";
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("vdashboard-theme", newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (themeToApply: Theme) => {
    const html = document.documentElement;
    if (themeToApply === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
