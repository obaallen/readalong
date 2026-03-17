"use client";

import { useEffect, useMemo, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggle = useMemo(
    () => () => {
      const next = theme === "dark" ? "light" : "dark";
      setTheme(next);
      if (next === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("ra_theme", next);
      } catch {}
    },
    [theme]
  );

  return { theme, toggle };
}

