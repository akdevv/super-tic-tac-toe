import Button from "@/components/shared/button";
import Toggle from "@/components/shared/toggle";
import { useTheme } from "@/context/ThemeContext";
import { Folders, Command, Info } from "@phosphor-icons/react";

export default function MiniModal({ isOpen, onClose }) {
	const { isDarkMode, toggleTheme } = useTheme();

	const handleClose = (e) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<div
			onClick={handleClose}
			className="bg-black bg-opacity-50 flex fixed inset-0 items-end px-6 py-4 md:px-8"
		>
			<div className="mb-24 p-5 border-2 border-black shadow-[6px_6px_0px_0px_#949392] space-y-4 bg-light-100 dark:bg-dark-800">
				{/* Profile Picture, Name, Email */}
				<div className="flex items-center space-x-3">
					<div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-dark-500" />
					<div>
						<h3 className="font-medium dark:text-white">
							John Doe
						</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							john@example.com
						</p>
					</div>
				</div>

				{/* Settings Buttons */}
				<div className="space-y-2 text-dark-900 dark:text-light-100">
					<div className="flex items-center gap-2">
						<Folders size={24} />
						<span>Your Games</span>
					</div>
					<div className="flex items-center gap-2">
						<Command size={24} />
						<span>Shortcuts</span>
					</div>
					<div className="flex items-center gap-2">
						<Info size={24} />
						<span>About</span>
					</div>
				</div>

				{/* Theme Toggle */}
				<div className="flex justify-between items-center text-dark-900 dark:text-light-100">
					Dark Mode
					<Toggle isOn={isDarkMode} onToggle={toggleTheme} />
				</div>

				{/* Logout Button */}
				<Button variant="secondary" size="full">
					Logout
				</Button>
			</div>
		</div>
	);
}
