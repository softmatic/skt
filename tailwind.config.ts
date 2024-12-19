import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import daisyui from "daisyui";

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	daisyui: {
		themes: [
			{
				light: {
					"color-scheme": "light",
					"primary": "#334155" ,// bg_slate_700 orig. "oklch(49.12% 0.3096 275.75)",
					"secondary": "oklch(69.71% 0.329 342.55)",
					"secondary-content": "oklch(98.71% 0.0106 342.55)",
					"accent": "oklch(76.76% 0.184 183.61)",
					"neutral": "#2B3440",
					"neutral-content": "#D7DDE4",
					"base-100": "oklch(100% 0 0)",
					"base-200": "#F2F2F2",
					"base-300": "#E5E6E6",
					"base-content": "#1f2937",
				  },
				  dark: {
					"color-scheme": "dark",
					"primary": "#A6ADBB", // base_content orig. "oklch(65.69% 0.196 275.75)",
					"secondary": "oklch(74.8% 0.26 342.55)",
					"accent": "oklch(74.51% 0.167 183.61)",
					"neutral": "#2a323c",
					"neutral-content": "#A6ADBB",
					"base-100": "#1d232a",
					"base-200": "#191e24",
					"base-300": "#15191e",
					"base-content": "#b6bDBB",
				},
			},
		],
	},	
	plugins: [typography, daisyui]
} satisfies Config;
