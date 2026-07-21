import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export const Switcher = () => {
  const getThemeFromStorage = () => {
    const stored = localStorage.getItem("theme");
    return stored === "dark" ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getThemeFromStorage);
  const isDark = theme === "dark";

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTheme = getThemeFromStorage();
      if (currentTheme !== theme) {
        setTheme(currentTheme);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggle = () => {
    const newTheme = isDark ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/15 sm:h-9 sm:w-9"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon
          size={18}
          className="text-teal-200 transition-transform duration-500"
        />
      ) : (
        <Sun
          size={18}
          className="text-amber-500 transition-transform duration-500"
        />
      )}
    </button>
  );
};
