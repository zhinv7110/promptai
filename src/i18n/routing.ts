import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'zh', 'ja', 'ko'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: true,
});

export const locales = ['en', 'zh', 'ja', 'ko'] as const;
export type Locale = (typeof locales)[number];
