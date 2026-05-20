export const dynamic = 'force-static';
import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getBlogPosts } from '@/lib/blog';
import { samplePrompts } from '@/lib/sample-prompts';

const BASE_URL = 'https://promptai.tools';

const staticRoutes = [
  { path: '', priority: 1, changeFreq: 'daily' as const },
  { path: '/prompt-generator', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/prompt-enhancer', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/style-generator', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/image-analyzer', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/negative-prompt', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/prompt-library', priority: 0.9, changeFreq: 'daily' as const },
  { path: '/blog', priority: 0.8, changeFreq: 'weekly' as const },
  { path: '/tools', priority: 0.7, changeFreq: 'weekly' as const },
  { path: '/about', priority: 0.5, changeFreq: 'monthly' as const },
  { path: '/pricing', priority: 0.5, changeFreq: 'monthly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Static routes for each locale
  for (const locale of routing.locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFreq,
        priority: route.priority,
      });
    }
  }

  // Dynamic: prompt detail pages
  for (const locale of routing.locales) {
    for (const prompt of samplePrompts) {
      entries.push({
        url: `${BASE_URL}/${locale}/prompt-library/${prompt.slug}`,
        lastModified: new Date(prompt.updated_at || prompt.created_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Dynamic: blog post pages
  for (const locale of routing.locales) {
    const posts = getBlogPosts(locale);
    for (const post of posts) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
