"use client";

import { createContext, useContext, useState } from "react";

export const SETTINGS_SECTIONS = {
	PROFILE: "profile",
	YOUR_GAMES: "your-games",
	SHORTCUTS: "shortcuts",
	ABOUT: "about",
};

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
	const [modals, setModals] = useState({
		settingsModal: false,
		compactModal: false,
		settingsDrawer: false,
	});

	// Track which settings section is active (default: profile)
	const [activeSection, setActiveSection] = useState(
		SETTINGS_SECTIONS.PROFILE
	);

	const toggleModal = (modal) => {
		setModals((prev) => ({ ...prev, [modal]: !prev[modal] }));
	};

	const openModal = (modal) => {
		setModals((prev) => ({ ...prev, [modal]: true }));
	};

	const closeModal = (modal) => {
		setModals((prev) => ({ ...prev, [modal]: false }));
	};

	const closeAllModals = () => {
		setModals({
			settingsModal: false,
			compactModal: false,
			settingsDrawer: false,
		});
	};

	const navigateToSection = (section) => {
		setActiveSection(section);
	};

	return (
		<SettingsContext.Provider
			value={{
				modals,
				activeSection,
				toggleModal,
				openModal,
				closeModal,
				closeAllModals,
				navigateToSection,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
}
