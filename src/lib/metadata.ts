// Shared SEO metadata utilities

import { routing } from '@/i18n/routing';
import { ogLocale as getOgLocale } from '@/lib/i18n-utils';
import type { Locale } from '@/i18n/routing';

const SITE_NAME = 'Thaumary AI';
const BASE_URL = 'https://thaumary.ai';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export function siteUrl(path: string = ''): string {
  return `${BASE_URL}${path}`;
}

export function canonicalUrl(locale: string, path: string = ''): string {
  return `${BASE_URL}/${locale}${path}`;
}

export function alternateUrls(path: string = ''): Record<string, string> {
  const urls: Record<string, string> = {};
  for (const loc of routing.locales) {
    urls[loc] = `${BASE_URL}/${loc}${path}`;
  }
  return urls;
}

// Open Graph metadata builder
export function ogMetadata(params: {
  title: string;
  description: string;
  locale?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  tags?: string[];
}) {
  const { title, description, locale = 'en', path = '', image, type = 'website', publishedTime, tags } = params;
  const url = canonicalUrl(locale, path);
  const alternates = alternateUrls(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image || DEFAULT_IMAGE, width: 1200, height: 630 }],
      locale: getOgLocale(locale as Locale),
      type,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [image || DEFAULT_IMAGE],
    },
    other: {
      ...(publishedTime ? { 'article:published_time': publishedTime } : {}),
      ...(tags ? { 'article:tag': tags.join(',') } : {}),
    },
  };
}

// Structured data builders
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: 'Free AI image prompt tools and library. Generate, enhance, and discover prompts for Midjourney, Stable Diffusion, and DALL-E.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/en/prompt-library?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function articleSchema(params: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  authorName?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.title,
    description: params.description,
    url: params.url,
    datePublished: params.datePublished,
    author: { '@type': 'Person', name: params.authorName || 'Thaumary AI' },
    image: params.image || DEFAULT_IMAGE,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export { SITE_NAME, BASE_URL, DEFAULT_IMAGE };
