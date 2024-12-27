"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		if (localStorage.getItem("theme")) {
			return localStorage.getItem("theme") === "dark";
		}
		return false;
	});

	// Load theme preference from localStorage on mount
	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme) {
			setIsDarkMode(savedTheme === "dark");
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = !isDarkMode;
		setIsDarkMode(newTheme);
		localStorage.setItem("theme", newTheme ? "dark" : "light");
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
