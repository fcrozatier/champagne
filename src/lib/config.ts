// The competition name
export const COMPETITION = 'SoME3';

// The different possible categories for entries
// No space as the strings are used in vote url
export const categories = ['video', 'non-video'] as const;
export type Category = (typeof categories)[number];
