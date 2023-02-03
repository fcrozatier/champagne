import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { hash, compare } from 'bcrypt';
import { ADMIN_PASSWORD } from '$env/static/private';
import { BCRYPT_ROUNDS, MAX_AGE } from '$lib/server/config';

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password');

		if (!password || typeof password !== 'string') {
			return fail(400, { invalid: true });
		}

		const adminHash = await hash(ADMIN_PASSWORD, BCRYPT_ROUNDS);
		const passwordValid = await compare(password, adminHash);

		if (!passwordValid) {
			return fail(400, { invalid: true });
		}

		cookies.set('password', adminHash, {
			httpOnly: true,
			path: '/',
			maxAge: MAX_AGE,
			sameSite: 'strict',
			secure: true
		});

		throw redirect(303, '/admin');
	}
};
