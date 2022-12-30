import {
	PUBLIC_REGISTRATION_START,
	PUBLIC_REGISTRATION_END,
	PUBLIC_VOTE_START,
	PUBLIC_VOTE_END,
	PUBLIC_RESULTS_AVAILABLE
} from '$env/static/public';

export function competitionStarted() {
	if (!PUBLIC_REGISTRATION_START) return false;
	const now = new Date();
	const start = new Date(PUBLIC_REGISTRATION_START);
	return now > start;
}

function phaseOpen(startDate: string, endDate: string) {
	if (!startDate || !endDate) return false;

	const now = new Date();
	const openingDate = new Date(startDate);
	const closingDate = new Date(endDate);

	return now > openingDate && now < closingDate;
}

export function registrationOpen() {
	return phaseOpen(PUBLIC_REGISTRATION_START, PUBLIC_REGISTRATION_END);
}

export function voteOpen() {
	return phaseOpen(PUBLIC_VOTE_START, PUBLIC_VOTE_END);
}

export function resultsAvailabe() {
	return !!parseInt(PUBLIC_RESULTS_AVAILABLE);
}
