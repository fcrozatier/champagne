import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { DOMAIN, MAILGUN_API_KEY, ORIGIN } from '$env/static/private';
import { COMPETITION_FULL_NAME } from '../config';

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

const registrationEmailHtml = Object.values(
	import.meta.glob('./registrationEmail.html', {
		as: 'raw',
		eager: true
	})
)[0];

const registrationEmailTxt = Object.values(
	import.meta.glob('./registrationEmail.txt', {
		as: 'raw',
		eager: true
	})
)[0];

export async function sendRegistrationEmail(to: string, token: string) {
	await mg.messages.create(DOMAIN, {
		from: 'SoME <some@3blue1brown.com>',
		to,
		subject: `${COMPETITION_FULL_NAME} registration`,
		html: registrationEmailHtml.replace('%user.token%', token).replace('%domain%', ORIGIN),
		text: registrationEmailTxt.replace('%user.token%', token).replace('%domain%', ORIGIN)
	});
}

export async function addToMailingList(email: string, token: string) {
	await mg.lists.members.createMember(DOMAIN, {
		address: email,
		subscribed: 'yes',
		vars: JSON.stringify({ token })
	});
}
