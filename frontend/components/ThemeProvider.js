"use client";

import { createContext, useContext, useEffect, useState } from "react";

// React context that exposes the current theme and a toggle function to any
// component in the tree (used by the ThemeToggle button in the navbar).
const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

// Helper hook so components can do: const { theme, toggleTheme } = useTheme();
export const useTheme = () => useContext(ThemeContext);

/**
 * Decide the default theme based on the time of day.
 * Dark mode runs in the evening/night (6:00 PM – 5:59 AM), light during the day.
 */
function getThemeFromTimeOfDay() {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6 ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  // Start as "light" on the server to avoid a hydration mismatch; the real
  // theme is applied in useEffect once we're in the browser.
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // On first load: use the saved preference if the user picked one before,
  // otherwise fall back to the automatic time-of-day theme.
  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const initial = saved || getThemeFromTimeOfDay();
    setTheme(initial);
    setMounted(true);
  }, []);

  // Whenever the theme changes, add/remove the `dark` class on <html> so
  // Tailwind's dark: variants take effect.
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, mounted]);

  // Manual toggle from the navbar button. The choice is saved so it sticks
  // across page loads (and overrides the automatic time-of-day default).
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") localStorage.setItem("theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
