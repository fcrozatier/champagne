import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { DOMAIN, MAILGUN_API_KEY } from '$env/static/private';
import { emailTemplates, type TemplateName } from '$lib/config';

const from = 'SoME <some@3blue1brown.com>';
const mailgun = new Mailgun(formData);

export const mg = mailgun.client({ username: 'api', key: MAILGUN_API_KEY });

// https://documentation.mailgun.com/en/latest/api-email-validation.html
type Validation = {
	address: string;
	did_you_mean?: string;
	is_disposable_address: boolean;
	is_role_address: boolean;
	reason: string[];
	result: 'deliverable' | 'undeliverable' | 'do_not_send' | 'catch_all' | 'unknown';
	risk: 'high' | 'medium' | 'low' | 'unknown';
	root_address?: string;
};

export const validateEmail = async (email: string) => {
	try {
		return (await mg.validate.get(email)) as Validation; // improves default types
	} catch (error) {
		return null;
	}
};

export async function addToMailingList(email: string, token: string) {
	await mg.lists.members.createMember(`newsletter@${DOMAIN}`, {
		address: email,
		subscribed: 'yes',
		vars: JSON.stringify({ token }),
		upsert: 'yes' // update recipient if already subscribed
	});
}

export async function sendEmail<T extends TemplateName>(
	to: string,
	template: T,
	variables?: Record<(typeof emailTemplates)[T]['variables'][number], string>
) {
	const { subject } = emailTemplates[template];
	const messageVariables = new Map();

	if (variables) {
		for (const [key, value] of Object.entries(variables)) {
			messageVariables.set(`v:${key}`, value);
		}
	}

	if (subject) {
		await mg.messages.create(DOMAIN, {
			from,
			to,
			subject,
			template,
			...messageVariables
		});
	}
}

export async function sendTemplate(template: TemplateName) {
	await mg.messages.create(DOMAIN, {
		from,
		to: `newsletter@${DOMAIN}`,
		subject: emailTemplates[template].subject,
		template
	});
}
