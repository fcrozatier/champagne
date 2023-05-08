import { sendTemplate } from '$lib/server/email';
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { EmailTemplateSchema, validateForm } from '$lib/server/validation';

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			const validation = await validateForm(request, EmailTemplateSchema);

			if (!validation.success) {
				return fail(400, validation.error.flatten());
			}

			// Fire and forget
			sendTemplate(validation.data.template_name);

			return { success: true };
		} catch (e) {
			console.error('Could not send template', e);
			return fail(500);
		}
	}
};
