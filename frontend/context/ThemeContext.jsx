"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		// Check initial theme preference
		const savedTheme = localStorage.getItem("theme");
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;

		// Set initial theme based on localStorage or system preference
		const initialTheme = savedTheme ? savedTheme === "dark" : prefersDark;
		setIsDarkMode(initialTheme);

		// Update document class and localStorage
		if (initialTheme) {
			document.documentElement.classList.add("dark");
		}
	}, []);

	const toggleTheme = () => {
		setIsDarkMode((prev) => {
			const newTheme = !prev;
			// Update localStorage
			localStorage.setItem("theme", newTheme ? "dark" : "light");

			// Update document class
			if (newTheme) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}

			return newTheme;
		});
	};

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
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
