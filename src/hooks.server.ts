import { redirect, type Handle } from '@sveltejs/kit';
import { TokenSchema } from '$lib/server/validation';

export const handle = async function ({ event, resolve }) {
	const token = event.cookies.get('token');

	if (token) {
		const validation = TokenSchema.safeParse(token);
		if (!validation.success) {
			event.cookies.delete('token');
			throw redirect(303, '/');
		}

		event.locals.token = validation.data;
	}

	const response = await resolve(event);
	return response;
} satisfies Handle;
