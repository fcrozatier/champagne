import {
	isDate,
	isDateTime,
	isDuration,
	isInt,
	isLocalDateTime,
	isLocalTime,
	isTime
} from 'neo4j-driver';
import {
	REGISTRATION_END,
	REGISTRATION_START,
	RESULTS_AVAILABLE,
	VOTE_END,
	VOTE_START
} from '$lib/config';

export function competitionStarted() {
	if (!REGISTRATION_START) return false;
	const now = new Date();
	const start = new Date(REGISTRATION_START);
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
	return phaseOpen(REGISTRATION_START, REGISTRATION_END);
}

export function voteOpen() {
	return phaseOpen(VOTE_START, VOTE_END);
}

export function resultsAvailable() {
	return RESULTS_AVAILABLE;
}

interface Properties {
	[key: string]: any;
}

/**
 * Convert Neo4j Properties back into JavaScript types
 */
export function toNativeTypes<T extends Properties>(properties: T) {
	return Object.fromEntries(
		Object.keys(properties).map((key) => {
			const value = valueToNativeType(properties[key]);

			return [key, value];
		})
	);
}

/**
 * Convert an individual value to its JavaScript equivalent
 */
function valueToNativeType(value: any) {
	if (Array.isArray(value)) {
		value = value.map((innerValue) => valueToNativeType(innerValue));
	} else if (isInt(value)) {
		value = value.toNumber();
	} else if (
		isDate(value) ||
		isDateTime(value) ||
		isTime(value) ||
		isLocalDateTime(value) ||
		isLocalTime(value) ||
		isDuration(value)
	) {
		value = value.toString();
	} else if (typeof value === 'object' && value !== undefined && value !== null) {
		value = toNativeTypes(value);
	}

	return value;
}
