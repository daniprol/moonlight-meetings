// Can be imported from a shared config
export const locales = ['en', 'es', 'gl'] as const;

export type Locale = typeof locales[number];