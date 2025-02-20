import Toggle from "@/components/shared/toggle";
import Button from "@/components/shared/button";
import { useTheme } from "@/context/ThemeContext";
import { Folders, Command, Info } from "@phosphor-icons/react";
import { useSettings, SETTINGS_SECTIONS } from "@/context/SettingsContext";

export default function CompactSettings() {
	const { isDarkMode, toggleTheme } = useTheme();
	const { openModal, closeAllModals, navigateToSection } = useSettings();

	const handleSectionClick = (section) => {
		closeAllModals();
		openModal("settingsModal");
		navigateToSection(section);
	};

	return (
		<div className="space-y-4 text-light-900 dark:text-dark-100 font-normal">
			{/* Profile */}
			<div
				className="flex gap-2 items-end cursor-pointer"
				onClick={() => handleSectionClick(SETTINGS_SECTIONS.PROFILE)}
			>
				<div className="w-14 h-14 bg-player-red rounded-full border-2 border-black font-medium" />
				<div>
					<p>username</p>
					<p>username@gmail.com</p>
				</div>
			</div>
			{/* Divider */}
			<div className="w-full bg-dark-400 rounded-full h-0.5" />

			{/* Settings Section Buttons */}
			<div>
				<div
					className="flex items-center gap-2 cursor-pointer hover:bg-light-200 dark:hover:bg-dark-500 p-2 rounded-lg"
					onClick={() =>
						handleSectionClick(SETTINGS_SECTIONS.YOUR_GAMES)
					}
				>
					<Folders size={24} />
					<span>Your Games</span>
				</div>

				<div
					className="flex items-center gap-2 cursor-pointer hover:bg-light-200 dark:hover:bg-dark-500 p-2 rounded-lg"
					onClick={() =>
						handleSectionClick(SETTINGS_SECTIONS.SHORTCUTS)
					}
				>
					<Command size={24} />
					<span>Shortcuts</span>
				</div>

				<div
					className="flex items-center gap-2 cursor-pointer hover:bg-light-200 dark:hover:bg-dark-500 p-2 rounded-lg"
					onClick={() => handleSectionClick(SETTINGS_SECTIONS.ABOUT)}
				>
					<Info size={24} />
					<span>About</span>
				</div>
			</div>

			{/* Theme Toggle */}
			<div className="flex justify-between items-center">
				<span>Dark Mode</span>
				<Toggle isOn={isDarkMode} onToggle={toggleTheme} />
			</div>

			{/* Logout Button */}
			<Button variant="secondary" size="full">
				Logout
			</Button>
		</div>
	);
}
