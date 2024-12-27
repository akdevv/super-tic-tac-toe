"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
	const [isDarkMode, setIsDarkMode] = useState(
		typeof window !== "undefined"
			? localStorage.getItem("theme") === "dark" ||
					window.matchMedia("(prefers-color-scheme: dark)").matches
			: false
	);

	useEffect(() => {
		const root = document.documentElement;
		root.classList.toggle("dark", isDarkMode);
		root.style.colorScheme = isDarkMode ? "dark" : "light";
		localStorage.setItem("theme", isDarkMode ? "dark" : "light");
	}, [isDarkMode]);

	return (
		<ThemeContext.Provider
			value={{
				isDarkMode,
				toggleTheme: () => setIsDarkMode(!isDarkMode),
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useTheme must be used within ThemeProvider");
	return context;
}
