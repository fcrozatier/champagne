const typography = require('@tailwindcss/typography');
const daisyui = require('daisyui');

/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						color: theme('colors.gray.800')
					}
				}
			})
		}
	},
	plugins: [typography, daisyui]
};
