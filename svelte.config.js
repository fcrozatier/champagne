import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import rehypeTargetBlank from 'rehype-anchor-target';

/**
 * @type {import('mdsvex').MdsvexOptions}
 */
const mdsvexOptions = {
	extensions: ['.md'],
	layout: './src/lib/components/LayoutProse.svelte',
	rehypePlugins: [rehypeTargetBlank]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

	kit: {
		adapter: adapter({
			runtime: 'nodejs18.x'
		})
	}
};

export default config;
