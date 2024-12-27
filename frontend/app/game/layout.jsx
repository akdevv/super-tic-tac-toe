import Footer from "@/components/shared/footer";
import { SettingsProvider } from "@/context/SettingsContext";

export default function GameLayout({ children }) {
	return (
		<SettingsProvider>
			<div vaul-drawer-wrapper="">
				<main className="h-screen flex flex-col px-6 py-4 md:px-8 justify-between bg-light-200 dark:bg-dark-800 transition-colors duration-300">
					{children}
					<Footer />
				</main>
			</div>
		</SettingsProvider>
	);
}
