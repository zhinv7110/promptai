import { routing } from '@/i18n/routing';

export function localeParams() {
  return routing.locales.map((locale) => ({ locale }));
}
