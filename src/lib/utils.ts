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
	PUBLIC_REGISTRATION_END,
	PUBLIC_REGISTRATION_START,
	PUBLIC_RESULTS_AVAILABLE,
	PUBLIC_VOTE_END,
	PUBLIC_VOTE_START
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

export function resultsAvailable() {
	return Boolean(parseInt(PUBLIC_RESULTS_AVAILABLE));
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

export const YOUTUBE_VIDEO_REGEX = /youtube\.com\/watch\?v=(.*)/;
