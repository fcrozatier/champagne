// The competition name
export const COMPETITION_FULL_NAME = 'Summer of Math Exposition';
export const COMPETITION_SHORT_NAME = 'SoME';

// The different possible categories for entries
// No space as the strings are used in vote url
export const categories = ['video', 'non-video'] as const;
export type Category = (typeof categories)[number];

export const userTypes = ['creator', 'judge'] as const;

export const listFormatter = new Intl.ListFormat('en', { type: 'disjunction', style: 'short' });
