import React, { useEffect, useState, createContext } from "react";

export const ThemeContext = createContext();

export const useTheme = () => {
  return React.useContext(ThemeContext);
};

export const CustomThemeProvider = ({ children }) => {
  // Use lazy initialization to avoid running logic during render
  const [theme, setTheme] = useState(() => {
    // Only run this once on mount
    if (typeof window === 'undefined') return 'dark';
    try {
      const saved = localStorage.getItem('dark');
      if (saved) {
        return JSON.parse(saved) ? 'dark' : 'light';
      }
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  });

  // Effect to apply data-theme attribute to HTML element
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.setAttribute("data-theme", "dark");
    } else {
      html.removeAttribute("data-theme");
    }
    // Persist theme preference
    try {
      localStorage.setItem("dark", JSON.stringify(theme === "dark"));
    } catch (e) {
      // Storage error - ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
