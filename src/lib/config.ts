// The competition name
export const COMPETITION = 'SoME3';

// The different possible categories for entries
// No space as the strings are used in vote url
export const categories = ['video', 'non-video'] as const;
export type Category = (typeof categories)[number];

// Dates in "yyyy-mm-ddThh:mm:ssZ" ISO 8601 format
// const REGISTRATION_START=""
export const REGISTRATION_START = '2022-07-31T12:00:00Z';
export const REGISTRATION_END = '2023-01-31T12:00:00Z';
// const VOTE_START=""
export const VOTE_START = '2022-08-31T12:00:00Z';
export const VOTE_END = '2023-08-31T12:00:00Z';
