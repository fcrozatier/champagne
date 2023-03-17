import { fail } from '@sveltejs/kit';
import { z } from 'zod';

export const EmailSchema = z.string().email();
export const TokenSchema = z.string().uuid();
export const UrlSchema = z.string().url();
export const PwdSchema = z.string();

export async function tokenValidation(request: Request) {
	const formData = await request.formData();
	const token = formData.get('token');
	const validation = TokenSchema.safeParse(token);

	if (!validation.success) {
		return fail(400, { error: true });
	}

	return validation.data;
}
