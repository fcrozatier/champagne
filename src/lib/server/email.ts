import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { DOMAIN, MAILGUN_API_KEY, ORIGIN } from '$env/static/private';

const mailgun = new Mailgun(formData);

export const mg = mailgun.client({ username: 'api', key: MAILGUN_API_KEY });

const registrationEmail = Object.values(
	import.meta.glob('./registrationEmail.html', {
		as: 'raw',
		eager: true
	})
)[0];

export async function sendRegistrationEmail(to: string, token: string) {
	await mg.messages.create(DOMAIN, {
		from: 'SoME3 <fred@samples.mailgun.org>',
		to,
		subject: 'SoME3 registration',
		html: registrationEmail.replace('%user.token%', token).replace('%domain%', ORIGIN)
	});
}
