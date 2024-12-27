/** @type {import('tailwindcss').Config} */

const gameColors = {
	player: {
		red: "#FF746C",
		"red-dark": "#FF2F23",
		"red-light": "#FFB9B5",

		blue: "#90D5FF",
		"blue-dark": "#40B7FF",
		"blue-light": "#E0F3FF",
	},
	success: {
		normal: "#00BB77",
		dark: "#00965F",
		light: "#00E08F",
	},
	warn: {
		normal: "#FFB343",
		dark: "#FF9903",
		light: "#FFCD83",
	},
	error: {
		normal: "#FF2C2C",
		dark: "#EF0000",
		light: "#FF6868",
	},
	light: {
		100: "#FFFFFF",
		200: "#F2F0EF",
		300: "#E6E4E3",
		400: "#C9C8C7",
		500: "#B4B3B2",
		600: "#949392",
		700: "#7A7877",
		800: "#66615E",
		900: "#252525",
	},
	dark: {
		100: "#FFFFFF",
		200: "#CFCFCF",
		300: "#ABABAB",
		400: "#7D7D7D",
		500: "#545454",
		600: "#3E3E3E",
		700: "#2E2E2E",
		800: "#252525",
		900: "#1A1A1A",
	},
};

const config = {
	darkMode: "class",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: { ...gameColors },
			fontFamily: {
				inter: ["Inter", "sans-serif"],
				fira: ["Fira Mono", "sans-serif"],
				lilita: ["Lilita One", "sans-serif"],
				bricolage: ["Bricolage Grotesque", "sans-serif"],
			},
		},
	},
};

export default config;
