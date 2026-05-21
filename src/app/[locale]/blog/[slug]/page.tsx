import { getBlogPost, getBlogPosts } from '@/lib/data';
import { Calendar, Tag, ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { canonicalUrl, alternateUrls, breadcrumbSchema } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { Metadata } from 'next';
import type { BlogPost } from '@/types';

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getBlogPost(slug, locale);
  if (!post) return { title: 'Not Found' };
  const title = locale === 'zh' ? post.title_zh : post.title_en;
  const desc = locale === 'zh' ? (post.excerpt_zh || post.title_zh) : (post.excerpt_en || post.title_en);
  const url = canonicalUrl(locale, `/blog/${slug}`);
  return {
    title: `${title} | Thaumary Blog`,
    description: desc,
    alternates: { canonical: url, languages: alternateUrls(`/blog/${slug}`) },
    openGraph: { title, description: desc, url, siteName: 'Thaumary', type: 'article', publishedTime: post.date, images: [{ url: 'https://thaumary.ai/og-image.png', width: 1200, height: 630 }], locale: locale === 'zh' ? 'zh_CN' : 'en_US' },
    twitter: { card: 'summary_large_image', title, description: desc },
    other: { 'article:published_time': post.date, 'article:tag': post.tags?.join(',') || '' },
  };
}

// Extract headings from HTML content for TOC
function extractTOC(html: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      text: match[2].replace(/<[^>]*>/g, '').trim(),
      id: match[2].replace(/<[^>]*>/g, '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
  }
  return headings;
}

// Generate FAQ schema from article content
function generateFAQSchema(title: string, content: string, url: string) {
  const headings = extractTOC(content);
  if (headings.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: content.replace(/<[^>]*>/g, '').slice(0, 160),
    url,
    datePublished: new Date().toISOString(),
    author: { '@type': 'Organization', name: 'Thaumary' },
    publisher: { '@type': 'Organization', name: 'Thaumary', logo: { '@type': 'ImageObject', url: 'https://thaumary.ai/og-image.png' } },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;
  const isZh = locale === 'zh';
  const post = await getBlogPost(slug, locale);
  if (!post) notFound();

  const title = isZh ? post.title_zh : post.title_en;
  const excerpt = isZh ? post.excerpt_zh : post.excerpt_en;
  const content = isZh ? (post.content_zh || post.content_en || '') : (post.content_en || post.content_zh || '');
  const toc = extractTOC(content);
  const faqSchema = generateFAQSchema(title, content, canonicalUrl(locale, `/blog/${slug}`));
  const breadcrumb = breadcrumbSchema([
    { name: isZh ? '首页' : 'Home', url: canonicalUrl(locale) },
    { name: isZh ? '博客' : 'Blog', url: canonicalUrl(locale, '/blog') },
    { name: title, url: canonicalUrl(locale, `/blog/${slug}`) },
  ]);

  // Related posts — same tags
  const allPosts = await getBlogPosts(locale);
  const related = allPosts.filter((p: BlogPost) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd data={breadcrumb} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <Link href={`/${locale}/blog`} className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-600 mb-8"><ArrowLeft className="h-4 w-4" />{isZh ? '返回博客' : 'Back to Blog'}</Link>

        <div className="flex flex-wrap gap-3 text-sm text-zinc-400 mb-4">
          <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {post.date?.split('T')[0] || ''}</span>
          {post.tags?.length > 0 && <span className="inline-flex items-center gap-1.5"><Tag className="h-4 w-4" /> {post.tags.join(', ')}</span>}
        </div>

        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">{title}</h1>
        {excerpt && <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{excerpt}</p>}

        {/* Table of Contents */}
        {toc.length > 0 && (
          <nav className="mt-8 glass rounded-2xl p-5" aria-label={isZh ? '目录' : 'Table of Contents'}>
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">{isZh ? '目录' : 'Table of Contents'}</h2>
            <ul className="space-y-1.5">
              {toc.map((h) => (
                <li key={h.id} className={h.level === 3 ? 'ml-4' : ''}>
                  <a href={`#${h.id}`} className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">{h.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Article */}
        <article className="mt-8 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />

        {/* Tags + Share */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-2 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-xs text-zinc-400 mr-2">{isZh ? '标签' : 'Tags'}:</span>
            {post.tags.map((t: string) => (
              <Link key={t} href={`/${locale}/search?q=${encodeURIComponent(t)}`} className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs text-zinc-500 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-600 transition-colors">
                {t}
              </Link>
            ))}
          </div>
        )}

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">{isZh ? '相关文章' : 'Related Articles'}</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((rp: BlogPost) => (
                <Link key={rp.slug} href={`/${locale}/blog/${rp.slug}`} className="group glass rounded-xl p-4 glass-hover">
                  <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-2 group-hover:text-purple-600 transition-colors">{isZh ? rp.title_zh : rp.title_en}</h3>
                  <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{isZh ? rp.excerpt_zh : rp.excerpt_en}</p>
                  <div className="mt-2 text-xs text-zinc-400">{rp.date?.split('T')[0]}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700">
            <ArrowLeft className="h-4 w-4" />{isZh ? '查看所有文章' : 'View all posts'}
          </Link>
        </div>
      </div>
    </>
  );
}
