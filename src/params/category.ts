import type { ParamMatcher } from '@sveltejs/kit';
import { categories } from '$lib/categories';
import { z } from 'zod';

export const match = ((param) => {
	return z.enum(categories).safeParse(param).success;
}) satisfies ParamMatcher;
