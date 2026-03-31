import React, { useEffect, useState, createContext } from "react";

export const ThemeContext = createContext();

export const useTheme = () => {
  return React.useContext(ThemeContext);
};

export const CustomThemeProvider = ({ children }) => {
	const getInitialMode = () => {
		if (typeof localStorage === "undefined") return true; // Default to dark if localStorage not available
		const isReturningUser = "dark" in localStorage;
		const savedMode = JSON.parse(localStorage.getItem("dark"));
		const userPrefersDark = getPrefColorScheme();
		if (isReturningUser) {
			return savedMode;
		}
		return !!userPrefersDark; // Respect system preference
	};

	const getPrefColorScheme = () => {
		if (!window.matchMedia) return;
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	};

	const [theme, setTheme] = useState(getInitialMode() ? "dark" : "light");

	// Effect to apply data-theme attribute to HTML element
	useEffect(() => {
		const html = document.documentElement;
		if (theme === "dark") {
			html.setAttribute("data-theme", "dark");
		} else {
			html.removeAttribute("data-theme"); // Remove for light mode
		}
		// Persist theme preference
		localStorage.setItem("dark", JSON.stringify(theme === "dark"));
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