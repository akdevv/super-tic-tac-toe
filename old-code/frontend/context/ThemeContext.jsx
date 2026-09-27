"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

function getInitialTheme() {
	if (typeof window === "undefined") return false;

	const savedTheme = localStorage.getItem("theme");
	if (savedTheme) {
		return savedTheme === "dark";
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function updateTheme(isDark) {
	const root = document.documentElement;
	root.classList.toggle("dark", isDark);
	root.style.colorScheme = isDark ? "dark" : "light";
	localStorage.setItem("theme", isDark ? "dark" : "light");
}

export function ThemeProvider({ children }) {
	const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

	useEffect(() => {
		updateTheme(isDarkMode);
	}, [isDarkMode]);

	const toggleTheme = () => setIsDarkMode((prev) => !prev);

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
