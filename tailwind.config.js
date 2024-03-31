/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				playerRed: "#FF6969",
				playerBlue: "#3DB2FF",
				primaryLight: "#F2EFE5",
				primaryDark: "#000000",
				primaryGray: "#9C9C9C",
			},
			fontFamily: {
				firaMono: ["Fira Mono", "sans"],
				poppins: ["Poppins", "sans"],
			},
			width: {
				"1/9": "11.1111111%",
			},
		},
	},
	plugins: [],
};
