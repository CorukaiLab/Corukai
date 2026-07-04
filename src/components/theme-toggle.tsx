"use client";

import { useEffect, useState } from "react";

interface ThemeOption {
  id: "light" | "night";
  label: string;
}

const themeOptions: ThemeOption[] = [
  { id: "light", label: "Claro" },
  { id: "night", label: "Nocturno" },
];

export function ThemeToggle() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption["id"]>(() => {
    if (typeof window === "undefined") return "light";

    const storedTheme = window.localStorage.getItem("corukai-theme");
    return storedTheme === "night" ? "night" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
    window.localStorage.setItem("corukai-theme", selectedTheme);
  }, [selectedTheme]);

  function handleThemeChange(theme: ThemeOption["id"]) {
    setSelectedTheme(theme);
  }

  return (
    <div className="theme-toggle" aria-label="Cambiar tema">
      {themeOptions.map((option) => (
        <button
          aria-pressed={selectedTheme === option.id}
          className="theme-toggle__button"
          key={option.id}
          onClick={() => handleThemeChange(option.id)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
