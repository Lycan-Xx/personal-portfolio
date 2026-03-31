import React, { useEffect, useState, createContext } from "react";

export const ThemeContext = createContext();

export const useTheme = () => {
  return React.useContext(ThemeContext);
};

export const CustomThemeProvider = ({ children }) => {
  // Use lazy initialization to read from localStorage synchronously
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      const saved = localStorage.getItem('dark');
      if (saved) return JSON.parse(saved) ? 'dark' : 'light';
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch { return 'dark'; }
  });

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.setAttribute("data-theme", "dark");
    } else {
      html.removeAttribute("data-theme");
    }
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
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
