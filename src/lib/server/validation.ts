import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { categories } from '$lib/categories';

export const EmailSchema = z.string().email();
export const TokenSchema = z.string().uuid();
export const UrlSchema = z.string().url();
export const PwdSchema = z.string();

const CheckboxSchema = z.literal('on', {
	errorMap: () => {
		return { message: 'Must be checked' };
	}
});

const JudgeSchema = z.object({
	userType: z.literal('judge'),
	email: EmailSchema,
	rules: CheckboxSchema
});

const CreatorSchema = z.object({
	userType: z.literal('creator'),
	email: EmailSchema,
	others: z.string().transform((val, ctx) => {
		const parsed = z.array(z.string().email()).safeParse(JSON.parse(val));

		if (!parsed.success) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Invalid email'
			});
			return z.NEVER;
		}
		return parsed.data;
	}),
	category: z.enum(categories),
	title: z.string().trim().nonempty({ message: 'Title cannot be empty' }),
	description: z
		.string()
		.trim()
		.min(10, { message: 'Description too short' })
		.max(500, { message: 'Description too long' }),
	link: UrlSchema,
	rules: CheckboxSchema
});

export const RegistrationSchema = z.discriminatedUnion('userType', [JudgeSchema, CreatorSchema]);

export async function tokenValidation(request: Request) {
	const formData = await request.formData();
	const token = formData.get('token');
	const validation = TokenSchema.safeParse(token);

	if (!validation.success) {
		return fail(400, { error: true });
	}

	return validation.data;
}
