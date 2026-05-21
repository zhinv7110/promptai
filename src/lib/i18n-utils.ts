import type { Locale } from '@/i18n/routing';

export function localizedField(
  item: any,
  field: string,
  locale: string,
): string {
  const key = `${field}_${locale}`;
  if (typeof item[key] === 'string' && (item[key] as string).length > 0) {
    return item[key] as string;
  }
  const enKey = `${field}_en`;
  if (typeof item[enKey] === 'string') {
    return item[enKey] as string;
  }
  return '';
}

export function localizedLabel<
  T extends { en: string; zh?: string; ja?: string; ko?: string },
>(item: T, locale: string): string {
  if (locale === 'en') return item.en;
  if (locale === 'zh' && item.zh) return item.zh;
  if (locale === 'ja' && item.ja) return item.ja;
  if (locale === 'ko' && item.ko) return item.ko;
  return item.en;
}

export function ogLocale(locale: Locale): string {
  const map: Record<Locale, string> = {
    en: 'en_US',
    zh: 'zh_CN',
    ja: 'ja_JP',
    ko: 'ko_KR',
  };
  return map[locale] || 'en_US';
}

export function languageName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: 'English',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
  };
  return names[locale] || 'English';
}
