import { getPromptBySlug, getPrompts } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight, Sparkles, Heart, Eye, Tag, Info, Layers, Zap } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { canonicalUrl, alternateUrls, breadcrumbSchema } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { Metadata } from 'next';
import type { Prompt } from '@/types';

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) return { title: 'Not Found' };
  const title = locale === 'zh' ? prompt.title_zh : prompt.title_en;
  const desc = locale === 'zh' ? (prompt.description_zh || prompt.title_zh) : (prompt.description_en || prompt.title_en);
  const url = canonicalUrl(locale, `/prompt-library/${slug}`);
  return {
    title: `${title} | Thaumary`,
    description: desc,
    alternates: { canonical: url, languages: alternateUrls(`/prompt-library/${slug}`) },
    openGraph: { title: `${title} - AI Prompt`, description: desc, url, siteName: 'Thaumary', images: [{ url: 'https://thaumary.ai/og-image.png', width: 1200, height: 630 }], locale: locale === 'zh' ? 'zh_CN' : 'en_US', type: 'article' },
    twitter: { card: 'summary_large_image', title, description: desc },
    other: { 'article:tag': prompt.tags?.join(',') || '' },
  };
}

// Extract keywords from prompt for visual highlighting
function highlightKeywords(text: string): { segments: { text: string; highlight: boolean }[] } {
  const keywords = /\b(8K|4K|HD|cinematic|photorealistic|hyperrealistic|masterpiece|professional|detailed|sharp|breathtaking|award.winning|editorial|photography|lighting|portrait|landscape|concept art|macro|style|render|composition|octane|unreal engine|artstation|midjourney|ghibli|anime|DALL.E|stable.diffusion)\b/gi;
  const parts = text.split(keywords);
  return parts.map((text, i) => ({ text, highlight: keywords.test(text) }));
}

export default async function PromptDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const isZh = locale === 'zh';

  const prompt = await getPromptBySlug(slug);
  if (!prompt) notFound();

  const title = isZh ? prompt.title_zh : prompt.title_en;
  const description = isZh ? prompt.description_zh : prompt.description_en;

  const related = (await getPrompts({ category: prompt.category, limit: 4, orderBy: 'likes_count' }))
    .filter((p: Prompt) => p.id !== prompt.id).slice(0, 3);

  const breadcrumb = breadcrumbSchema([
    { name: isZh ? '首页' : 'Home', url: canonicalUrl(locale) },
    { name: isZh ? '提示词库' : 'Library', url: canonicalUrl(locale, '/prompt-library') },
    { name: title, url: canonicalUrl(locale, `/prompt-library/${slug}`) },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <Link href={`/${locale}/prompt-library`} className="hover:text-zinc-600 dark:hover:text-zinc-300">{isZh ? '提示词库' : 'Library'}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-zinc-600 dark:text-zinc-400">{title}</span>
        </nav>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link href={`/${locale}/categories/${prompt.category}`} className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/50 px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/70 transition-colors capitalize">
              {prompt.category.replace('-', ' ')}
            </Link>
            <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {prompt.model === 'stable-diffusion' ? 'Stable Diffusion' : prompt.model === 'dalle3' ? 'DALL-E 3' : prompt.model.charAt(0).toUpperCase() + prompt.model.slice(1)}
            </span>
            {prompt.is_premium && <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/50 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">Premium</span>}
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{title}</h1>
          {description && <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>}
        </div>

        {/* Prompt Card — enhanced readability */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-6 sm:px-8 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">{isZh ? '提示词' : 'Prompt'}</h2>
            <span className="ml-auto"><CopyButton text={prompt.prompt_text} /></span>
          </div>
          <div className="p-6 sm:p-8">
            <pre className="text-sm leading-relaxed whitespace-pre-wrap bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
              <code className="text-zinc-800 dark:text-zinc-200">{prompt.prompt_text}</code>
            </pre>
          </div>
          <div className="flex items-center gap-6 px-6 sm:px-8 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-1.5"><Heart className="h-4 w-4" /> {prompt.likes_count}</span>
            <span className="inline-flex items-center gap-1.5"><Eye className="h-4 w-4" /> {prompt.views_count}</span>
            <span className="ml-auto text-xs">{isZh ? '复制到 Midjourney / SD 直接使用' : 'Copy & paste into Midjourney / SD'}</span>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass rounded-xl p-3 text-center">
            <Layers className="h-4 w-4 text-purple-500 mx-auto mb-1" />
            <span className="text-xs text-zinc-500 block">{isZh ? '分类' : 'Category'}</span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 capitalize">{prompt.category.replace('-', ' ')}</span>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <Zap className="h-4 w-4 text-amber-500 mx-auto mb-1" />
            <span className="text-xs text-zinc-500 block">{isZh ? '模型' : 'Model'}</span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{prompt.model}</span>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <Heart className="h-4 w-4 text-pink-500 mx-auto mb-1" />
            <span className="text-xs text-zinc-500 block">{isZh ? '收藏' : 'Likes'}</span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{prompt.likes_count}</span>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <Eye className="h-4 w-4 text-cyan-500 mx-auto mb-1" />
            <span className="text-xs text-zinc-500 block">{isZh ? '浏览' : 'Views'}</span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{prompt.views_count}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-zinc-400" />
          {prompt.tags.map((tag: string) => (
            <Link key={tag} href={`/${locale}/tags/${encodeURIComponent(tag)}`} className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-600 transition-colors">
              {tag}
            </Link>
          ))}
        </div>

        {/* Usage Tips */}
        <div className="mt-8 glass rounded-2xl p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            <Info className="h-4 w-4 text-purple-500" />
            {isZh ? '使用建议' : 'Usage Tips'}
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 text-xs text-zinc-500 dark:text-zinc-400">
            <div>• {isZh ? '复制提示词到 Midjourney 直接生成' : 'Copy prompt directly to Midjourney'}</div>
            <div>• {isZh ? '在 SD 中放入 Positive Prompt 框' : 'Paste into SD Positive Prompt field'}</div>
            <div>• {isZh ? '可添加 --ar 16:9 设置宽高比' : 'Add --ar 16:9 for widescreen ratio'}</div>
            <div>• {isZh ? '配合负面提示词获得更好结果' : 'Use with negative prompts for best results'}</div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">{isZh ? '相关提示词' : 'Related Prompts'}</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((rp: Prompt) => (
                <Link key={rp.id} href={`/${locale}/prompt-library/${rp.slug}`} className="group glass rounded-xl p-4 glass-hover">
                  <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1 group-hover:text-purple-600 transition-colors">{isZh ? rp.title_zh : rp.title_en}</h3>
                  <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{isZh ? rp.description_zh : rp.description_en}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                    <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {rp.likes_count}</span>
                    <span>{rp.model === 'stable-diffusion' ? 'SD' : rp.model === 'dalle3' ? 'DALL·E 3' : rp.model.charAt(0).toUpperCase() + rp.model.slice(1)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <Link href={`/${locale}/prompt-library`} className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />{isZh ? '返回提示词库' : 'Back to Library'}
          </Link>
        </div>
      </div>
    </>
  );
}
