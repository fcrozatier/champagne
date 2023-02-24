import type { ParamMatcher } from '@sveltejs/kit';
import { categories } from '$lib/categories';

export const match = ((param) => {
	return categories.includes(param);
}) satisfies ParamMatcher;
