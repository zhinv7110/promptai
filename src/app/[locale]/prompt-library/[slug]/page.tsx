import { getPromptBySlug, getPrompts } from '@/lib/data';
import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight, Sparkles, Heart, Eye, Tag } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { canonicalUrl, alternateUrls } from '@/lib/metadata';
import { Metadata } from 'next';
import { samplePrompts } from '@/lib/sample-prompts';

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) return { title: 'Not Found' };

  const title = locale === 'zh' ? prompt.title_zh : prompt.title_en;
  const description = locale === 'zh' ? (prompt.description_zh || prompt.title_zh) : (prompt.description_en || prompt.title_en);
  const url = canonicalUrl(locale, `/prompt-library/${slug}`);

  return {
    title: `${title} | Thaumary`,
    description,
    alternates: { canonical: url, languages: alternateUrls(`/prompt-library/${slug}`) },
    openGraph: {
      title: `${title} - AI Prompt`,
      description,
      url,
      siteName: 'Thaumary',
      images: prompt.example_image_url ? [{ url: prompt.example_image_url }] : [{ url: 'https://thaumary.ai/og-image.png', width: 1200, height: 630 }],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title, description },
    other: { 'article:tag': prompt.tags?.join(',') || '' },
  };
}

export default async function PromptDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const isZh = locale === 'zh';

  const prompt = await getPromptBySlug(slug);
  if (!prompt) notFound();

  const title = isZh ? prompt.title_zh : prompt.title_en;
  const description = isZh ? prompt.description_zh : prompt.description_en;

  // Related prompts: same category or overlapping tags
  const related = (await getPrompts({ category: prompt.category, limit: 4, orderBy: 'likes_count' }))
    .filter((p) => p.id !== prompt.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
        <Link href={`/${locale}/prompt-library`} className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          {isZh ? '提示词库' : 'Library'}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-zinc-600 dark:text-zinc-400">{title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/50 px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 capitalize">
            {prompt.category.replace('-', ' ')}
          </span>
          <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 capitalize">
            {prompt.model === 'stable-diffusion' ? 'Stable Diffusion' : prompt.model === 'dalle3' ? 'DALL-E 3' : prompt.model === 'sdxl' ? 'SDXL' : prompt.model.charAt(0).toUpperCase() + prompt.model.slice(1)}
          </span>
          {prompt.is_premium && (
            <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/50 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
              Premium
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{title}</h1>
        {description && (
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
        )}
      </div>

      {/* Prompt Card */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                {isZh ? '提示词文本' : 'Prompt Text'}
              </h2>
            </div>
            <CopyButton text={prompt.prompt_text} />
          </div>
          <pre className="text-sm font-mono leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
            {prompt.prompt_text}
          </pre>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6 px-6 sm:px-8 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
            <Heart className="h-4 w-4" /> {prompt.likes_count}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-zinc-400">
            <Eye className="h-4 w-4" /> {prompt.views_count}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Tag className="h-4 w-4 text-zinc-400" />
        {prompt.tags.map((tag) => (
          <Link
            key={tag}
            href={`/${locale}/prompt-library?search=${encodeURIComponent(tag)}`}
            className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
            {isZh ? '相关提示词' : 'Related Prompts'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((rp) => (
              <Link
                key={rp.id}
                href={`/${locale}/prompt-library/${rp.slug}`}
                className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800 transition-all"
              >
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {isZh ? rp.title_zh : rp.title_en}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
                  {isZh ? rp.description_zh : rp.description_en}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {rp.likes_count}</span>
                  <span>{rp.model === 'stable-diffusion' ? 'SD' : rp.model === 'dalle3' ? 'DALL·E 3' : rp.model.charAt(0).toUpperCase() + rp.model.slice(1)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back */}
      <div className="mt-12">
        <Link
          href={`/${locale}/prompt-library`}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {isZh ? '返回提示词库' : 'Back to Library'}
        </Link>
      </div>
    </div>
  );
}
