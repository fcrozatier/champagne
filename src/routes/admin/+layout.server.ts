import { hash } from 'bcrypt';
import { ADMIN_PASSWORD } from '$env/static/private';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { BCRYPT_ROUNDS } from '$lib/server/config';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const adminPassword = cookies.get('password');

	if (adminPassword) {
		const isAdmin = adminPassword === (await hash(ADMIN_PASSWORD, BCRYPT_ROUNDS));
		return { isAdmin };
	}

	throw redirect(302, '/login');
};
