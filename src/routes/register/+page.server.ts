import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { registrationOpen } from '$lib/utils';

const entries = ['video', 'non-video'];
const users = ['creator', 'judge'];

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			if (!registrationOpen()) {
				return fail(422, { invalid: true });
			}

			const values = await request.formData();
			const user = values.get('user');
			const email = values.get('email');
			const entry = values.get('entry');
			const link = values.get('link');
			const rules = values.get('rules');

			if (!user || typeof user !== 'string' || !users.includes(user)) {
				return fail(400, { userInvalid: true });
			}

			if (!email || typeof email !== 'string') {
				return fail(400, { emailInvalid: true });
			}

			if (!entry || typeof entry !== 'string' || !entries.includes(entry)) {
				return fail(400, { entryInvalid: true });
			}

			if (!link || typeof link !== 'string') {
				return fail(400, { linkInvalid: true });
			}

			if (!rules) {
				return fail(400, { rulesInvalid: true });
			}

			// TODO save on db
			// const token = crypto.randomUUID();

			// TODO send mail

			return { success: true, email };
		} catch (error) {
			console.log(error);
			return fail(400, { invalid: true });
		}
	}
};
