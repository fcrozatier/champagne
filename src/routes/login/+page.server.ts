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
		console.log('password', password);
		const adminHash = await hash(ADMIN_PASSWORD, BCRYPT_ROUNDS);
		console.log('ADMIN_PASSWORD', ADMIN_PASSWORD);
		const passwordValid = await compare(password, adminHash);
		console.log('adminHash', adminHash);
		console.log('passwordValid', passwordValid);
		if (!passwordValid) {
			console.log('nope');
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
