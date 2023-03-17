import { z } from 'zod';
import { categories } from '$lib/categories';

export const EmailSchema = z.string().email();
export const TokenSchema = z.string().uuid();
export const UrlSchema = z.string().url();
export const PwdSchema = z.string();

// Registration phase validations

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
	others: z.string(),
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

export const OtherCreatorsRefinement = z.string().transform((val, ctx) => {
	try {
		const parsed = z.array(z.string().email()).safeParse(JSON.parse(val));

		if (!parsed.success) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Invalid email'
			});
			return z.NEVER;
		}

		return parsed.data;
	} catch {
		return z.NEVER;
	}
});

export const RegistrationSchema = z.discriminatedUnion('userType', [JudgeSchema, CreatorSchema]);

// Vote phase validation

export const FlagSchema = z.object({
	reason: z.string().max(140),
	link: UrlSchema
});

/**
 * Generic schema validation function to be used in actions
 * @param request A request with formData
 * @param schema The schema to validate the form against
 * @returns typed validated data or throws
 */
export async function validateSchema<T>(request: Request, schema: z.Schema<T>) {
	const formData = await request.formData();
	const form = Object.fromEntries(formData);
	const validation = schema.safeParse(form);

	return validation;
}
