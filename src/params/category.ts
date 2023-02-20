import type { ParamMatcher } from '@sveltejs/kit';
import { categories } from '$lib/categories';

export const match = ((param) => {
	return (categories as unknown as string[]).includes(param);
}) satisfies ParamMatcher;
