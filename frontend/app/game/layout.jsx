"use client";

import { Sun, Moon } from "@phosphor-icons/react";
import { Gear } from "@phosphor-icons/react";
import Button from "@/components/shared/button";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

export default function GameLayout({ children }) {
	const { isDarkMode, toggleTheme } = useTheme();
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	return (
		<main
			className={`${
				isDarkMode ? "bg-light-900" : "bg-light-200"
			} h-screen transition-colors duration-300`}
		>
			<div className="absolute top-4 right-4">
				<Button
					variant="icon"
					onClick={toggleTheme}
					aria-label={
						isDarkMode
							? "Switch to light mode"
							: "Switch to dark mode"
					}
				>
					{isDarkMode ? (
						<Sun size={24} weight="bold" />
					) : (
						<Moon size={24} weight="bold" />
					)}
				</Button>
			</div>

			<Button
				variant="icon"
				onClick={() => setIsSettingsOpen(!isSettingsOpen)}
			>
				<Gear size={28} />
			</Button>

			{children}
		</main>
	);
}
