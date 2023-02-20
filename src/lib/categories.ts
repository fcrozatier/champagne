export const categories = ['Video', 'Non Video'] as const;

export type Category = (typeof categories)[number];
