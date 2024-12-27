import { useSettings } from "@/context/SettingsContext";
import CompactSettings from "./content/compact-settings";

export default function CompactModal() {
	const { modals, closeModal } = useSettings();

	const handleClose = (e) => {
		if (e.target === e.currentTarget) closeModal("compactModal");
	};

	if (!modals.compactModal) return null;

	return (
		<div
			onClick={handleClose}
			className="flex fixed inset-0 items-end px-6 py-4 md:px-8"
		>
			<div className="mb-24 p-5 border-2 border-black shadow-[6px_6px_0px_0px_#949392] space-y-4 bg-light-100 dark:bg-dark-600">
				<CompactSettings />
			</div>
		</div>
	);
}
