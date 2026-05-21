export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function baseUrl(locale: string) {
  return `/${locale}`;
}

export function localize<T extends Record<string, string>>(
  obj: T,
  locale: string,
  key: keyof T
): string {
  const locKey = `${String(key)}_${locale}` as keyof T;
  return (obj[locKey] as string) ?? (obj[key] as string) ?? '';
}

export function getLocalizedField(
  item: any,
  field: string,
  locale: string
): string {
  const localizedKey = `${field}_${locale}`;
  if (typeof item[localizedKey] === 'string') {
    const val = item[localizedKey] as string;
    if (val.length > 0) return val;
  }
  const enKey = `${field}_en`;
  if (typeof item[enKey] === 'string') {
    return item[enKey] as string;
  }
  return (item[field] as string) ?? '';
}
