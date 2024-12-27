"use client";

import { Gear } from "@phosphor-icons/react";
import useDeviceType from "@/hooks/useDeviceType";
import { useSettings } from "@/context/SettingsContext";

import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import Button from "@/components/shared/button";
import CompactModal from "./compact-modal";
import SettingsModal from "./settings-modal";
import CompactSettings from "./content/compact-settings";

export default function SettingsButton() {
	const { isMobile } = useDeviceType();
	const { modals, openModal, closeModal } = useSettings();

	return (
		<>
			{modals.settingsModal && <SettingsModal />}
			{modals.compactModal && <CompactModal />}

			{isMobile ? (
				<Drawer
					open={modals.settingsDrawer}
					onOpenChange={(open) =>
						open
							? openModal("settingsDrawer")
							: closeModal("settingsDrawer")
					}
				>
					<DrawerTrigger asChild>
						<Button variant="icon">
							<Gear size={28} />
						</Button>
					</DrawerTrigger>

					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Settings</DrawerTitle>
							<DrawerDescription />
						</DrawerHeader>
						{/* Compact Settings */}
						<CompactSettings />
					</DrawerContent>
				</Drawer>
			) : (
				<Button
					variant="icon"
					onClick={() => openModal("compactModal")}
				>
					<Gear size={28} />
				</Button>
			)}
		</>
	);
}
