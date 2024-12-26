import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const metadata = {
	title: "Super Tic-Tac-Toe",
	description: "The best variation of Tic-Tac-Toe!",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className="font-inter">
			<body>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
