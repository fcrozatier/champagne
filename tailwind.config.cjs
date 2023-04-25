const typography = require('@tailwindcss/typography');
const daisyui = require('daisyui');

/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			DEFAULT: {
				css: {}
			}
		}
	},
	plugins: [typography, daisyui],
	daisyui: {
		themes: [
			{
				light: {
					...require('daisyui/src/colors/themes')['[data-theme=light]'],
					'base-content': '#09090b'
				}
			}
		]
	}
};
