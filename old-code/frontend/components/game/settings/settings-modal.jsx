import { useSettings, SETTINGS_SECTIONS } from "@/context/SettingsContext";

export default function SettingsModal() {
	const { modals, closeModal, activeSection, navigateToSection } =
		useSettings();

	const handleClose = (e) => {
		if (e.target === e.currentTarget) closeModal("settingsModal");
	};

	if (!modals.settingsModal) return null;

	return (
		<div
			onClick={handleClose}
			className="bg-black bg-opacity-50 flex fixed inset-0 items-end px-6 py-4 md:px-8"
		>
			<div className="mb-24 p-5 border-2 border-black shadow-[6px_6px_0px_0px_#949392] space-y-4 bg-light-100 dark:bg-dark-800">
				{/* Sidebar */}
				<div className="flex gap-8">
					<div className="flex flex-col gap-2">
						<div
							onClick={() =>
								navigateToSection(SETTINGS_SECTIONS.PROFILE)
							}
						>
							Profile
						</div>
						<div
							onClick={() =>
								navigateToSection(SETTINGS_SECTIONS.YOUR_GAMES)
							}
						>
							Your Games
						</div>
						<div
							onClick={() =>
								navigateToSection(SETTINGS_SECTIONS.SHORTCUTS)
							}
						>
							Shortcuts
						</div>
						<div
							onClick={() =>
								navigateToSection(SETTINGS_SECTIONS.ABOUT)
							}
						>
							About
						</div>
					</div>
					<div className="h-28 w-1 bg-black" />
					<h1>{activeSection}</h1>
				</div>
			</div>
		</div>
	);
}
