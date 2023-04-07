// No space as the strings are used in vote url
export const categories = ['video', 'non-video'] as const;
export type Category = (typeof categories)[number];

// The competition name
export const COMPETITION = 'SoME3';

const capitalize = (str: string) => {
	return str.length > 0 ? str[0].toUpperCase() + str.slice(1) : str;
};

export const display = (str: string) => {
	return str
		.split('-')
		.map((s) => capitalize(s))
		.join(' ');
};
