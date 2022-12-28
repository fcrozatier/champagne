import { PUBLIC_REGISTRATION_DEADLINE } from '$env/static/public';

export function registrationOpen() {
	const now = new Date();
	const deadline = new Date(PUBLIC_REGISTRATION_DEADLINE);

	return now < deadline;
}
