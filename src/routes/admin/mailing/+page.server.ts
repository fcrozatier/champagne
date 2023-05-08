import { sendTemplate } from '$lib/server/email';
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async () => {
		try {
			await sendTemplate();

			return { success: true };
		} catch (e) {
			console.error('Could not send template', e);
			return fail(500);
		}
	}
};
