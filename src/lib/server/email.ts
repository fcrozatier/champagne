import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { DOMAIN, MAILGUN_API_KEY, ORIGIN } from '$env/static/private';
import { COMPETITION } from '../config';

const mailgun = new Mailgun(formData);

export const mg = mailgun.client({ username: 'api', key: MAILGUN_API_KEY });

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
		subject: `${COMPETITION} registration`,
		html: registrationEmailHtml.replace('%user.token%', token).replace('%domain%', ORIGIN),
		text: registrationEmailTxt.replace('%user.token%', token).replace('%domain%', ORIGIN)
	});
}
