import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'zh'];
const defaultLocale = 'en';
const cookieName = 'NEXT_LOCALE';

function getLocale(request: NextRequest): string {
  // 1. Cookie
  const cookie = request.cookies.get(cookieName)?.value;
  if (cookie && locales.includes(cookie)) return cookie;

  // 2. Accept-Language header
  const acceptLang = request.headers.get('accept-language') || '';
  for (const preferred of acceptLang.split(',')) {
    const lang = preferred.split(';')[0].trim().slice(0, 2);
    if (locales.includes(lang)) return lang;
  }

  // 3. Default
  return defaultLocale;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if pathname starts with a locale
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (hasLocale) {
    // Persist locale + set next-intl header
    const locale = pathname.split('/')[1];
    const response = NextResponse.next();
    response.cookies.set(cookieName, locale, { path: '/', maxAge: 31536000 });
    response.headers.set('x-next-intl-locale', locale);
    return response;
  }

  // No locale — detect and redirect
  const locale = getLocale(request);
  const url = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
  url.search = request.nextUrl.search;

  const response = NextResponse.redirect(url);
  response.cookies.set(cookieName, locale, { path: '/', maxAge: 31536000 });
  return response;
}

export const config = {
  matcher: ['/', '/((?!_next|_vercel|api|.*\\..*).*)'],
};
