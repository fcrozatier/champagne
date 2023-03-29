import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		fs: {
			// Allow serving files from one level up to the project root (src/ folder with app.html)
			allow: [path.resolve('.')]
		}
	}
};

export default config;
