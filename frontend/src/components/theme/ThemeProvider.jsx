import React, { useEffect, useState, createContext } from "react";

// Module-level browser check
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export const ThemeContext = createContext();

export const useTheme = () => {
  return React.useContext(ThemeContext);
};

export const CustomThemeProvider = ({ children }) => {
	// Safe check for browser environment
	const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

	const getInitialMode = () => {
		if (!isBrowser) return true; // Default to dark if localStorage not available
		try {
			const isReturningUser = "dark" in localStorage;
			const savedMode = localStorage.getItem("dark") ? JSON.parse(localStorage.getItem("dark")) : null;
			const userPrefersDark = getPrefColorScheme();
			if (isReturningUser && savedMode !== null) {
				return savedMode;
			}
			return !!userPrefersDark; // Respect system preference
		} catch (e) {
			return true; // Default to dark on error
		}
	};

	const getPrefColorScheme = () => {
		if (!isBrowser || !window.matchMedia) return;
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	};

	const [theme, setTheme] = useState(getInitialMode() ? "dark" : "light");

	// Effect to apply data-theme attribute to HTML element
	useEffect(() => {
		if (!isBrowser) return;
		const html = document.documentElement;
		if (theme === "dark") {
			html.setAttribute("data-theme", "dark");
		} else {
			html.removeAttribute("data-theme"); // Remove for light mode
		}
		// Persist theme preference
		try {
			localStorage.setItem("dark", JSON.stringify(theme === "dark"));
		} catch (e) {
			// Storage quota exceeded or other error
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