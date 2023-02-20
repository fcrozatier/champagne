export const categories = ['Video', 'Non_Video'] as const;

export type Category = (typeof categories)[number];
