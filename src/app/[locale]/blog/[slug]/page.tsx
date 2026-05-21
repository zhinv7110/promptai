import { getBlogPost } from '@/lib/data';
import { getBlogPosts } from '@/lib/blog';
import { use } from 'react';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { canonicalUrl, alternateUrls } from '@/lib/metadata';
import { Metadata } from 'next';

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getBlogPost(slug, locale);
  if (!post) return { title: 'Not Found' };

  const title = locale === 'zh' ? post.title_zh : post.title_en;
  const description = locale === 'zh' ? (post.excerpt_zh || post.title_zh) : (post.excerpt_en || post.title_en);
  const url = canonicalUrl(locale, `/blog/${slug}`);

  return {
    title: `${title} | Thaumary Blog`,
    description,
    alternates: { canonical: url, languages: alternateUrls(`/blog/${slug}`) },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Thaumary',
      type: 'article',
      publishedTime: post.date,
      images: [{ url: 'https://thaumary.ai/og-image.png', width: 1200, height: 630 }],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description },
    other: { 'article:published_time': post.date, 'article:tag': post.tags?.join(',') || '' },
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

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/${locale}/blog`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        {isZh ? '返回博客' : 'Back to Blog'}
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-zinc-400 mb-3">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {post.date?.split('T')[0] || ''}
          </span>
          {post.tags && post.tags.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Tag className="h-4 w-4" /> {post.tags.join(', ')}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">{title}</h1>
        {excerpt && (
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{excerpt}</p>
        )}
      </header>

      <article
        className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {isZh ? '查看所有文章' : 'View all posts'}
        </Link>
      </div>
    </div>
  );
}
