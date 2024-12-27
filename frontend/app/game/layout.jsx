"use client";

import { Sun, Moon } from "@phosphor-icons/react";
import { Gear } from "@phosphor-icons/react";
import Button from "@/components/shared/button";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import Footer from "@/components/shared/footer";

export default function GameLayout({ children }) {
	const { isDarkMode, toggleTheme } = useTheme();
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	return (
		<main
			className={`${
				isDarkMode ? "bg-dark-800" : "bg-light-200"
			} h-screen flex flex-col px-6 py-4 md:px-8 justify-between`}
		>
			{children}
			<Footer />
		</main>
	);
}

// <Button
// 	variant="icon"
// 	onClick={toggleTheme}
// 	aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
// >
// 	{isDarkMode ? (
// 		<Sun size={24} weight="bold" />
// 	) : (
// 		<Moon size={24} weight="bold" />
// 	)}
// </Button>;
