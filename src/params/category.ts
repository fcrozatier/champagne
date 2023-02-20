import type { ParamMatcher } from '@sveltejs/kit';
import { categories } from '$lib/categories';

export const match = ((param) => {
	return categories.map((x) => x.toLowerCase()).includes(param);
}) satisfies ParamMatcher;
