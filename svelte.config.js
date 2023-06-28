import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { visit } from 'unist-util-visit';

function rehypeTargetBlank() {
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (node.tagName === 'a' && node.properties && typeof node.properties.href === 'string') {
				const url = node.properties.href;
				const isExternal = /^http/.test(url);

				if (isExternal) {
					node.properties.target = '_blank';
				}
			}
		});
	};
}

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
