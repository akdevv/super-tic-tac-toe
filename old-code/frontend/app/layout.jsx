import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
	title: "Super Tic-Tac-Toe",
	description: "The best variation of Tic-Tac-Toe!",
};

const setInitialTheme = `
  (function() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.className = theme;
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.className = prefersDarkMode ? 'dark' : '';
    }
  })();
`;

export default function RootLayout({ children }) {
	return (
		<html lang="en" className="font-inter" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
			</head>
			<body>
				<ThemeProvider>{children}</ThemeProvider>
				<Toaster />
			</body>
		</html>
	);
}
