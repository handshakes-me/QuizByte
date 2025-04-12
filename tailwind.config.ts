import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				"main": {
					50: "#E6E6E6",
					100: "#D9D9D9",
					200: "#BFBFBF",
					300: "#A6A6A6",
					400: "#8C8C8C",
					500: "#737373",
					600: "#595959",
					700: "#404040",
					800: "#262626",
					900: "#0D0D0D",
					950: "#000000"
				},
				"sky": {
					50: "#E5F4FA",
					100: "#CBEAF6",
					200: "#98D4EC",
					300: "#64BFE3",
					400: "#30A9D9",
					500: "#228EB9",
					600: "#1C7497",
					700: "#155670",
					800: "#0D3849",
					900: "#071E27",
					950: "#030D11"
				},
				"success": {
					50: "#EEFBF2",
					100: "#E2F8E8",
					200: "#C1F1CD",
					300: "#A4EAB5",
					400: "#82E39A",
					500: "#65DC83",
					600: "#44D568",
					700: "#2DC653",
					800: "#1E8538",
					900: "#0F431C",
					950: "#08210E"
				},
				"danger": {
					50: "#FFEBEC",
					100: "#FED2D3",
					200: "#FEA9AC",
					300: "#FD7C80",
					400: "#FD5459",
					500: "#FC262E",
					600: "#F2030B",
					700: "#C90309",
					800: "#9D0208",
					900: "#510104",
					950: "#280102"
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
