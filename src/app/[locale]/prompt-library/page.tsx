import { getPrompts } from '@/lib/data';
import { CATEGORIES } from '@/lib/constants';
import type { Prompt } from '@/types';
import { localizedField, localizedLabel } from '@/lib/i18n-utils';
import { Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import PromptCard from '@/components/prompts/PromptCard';

const catNames: Record<string, { en: string; zh: string }> = {
  portrait: { en: 'Portrait', zh: '人像' },
  landscape: { en: 'Landscape', zh: '风景' },
  fantasy: { en: 'Fantasy', zh: '奇幻' },
  anime: { en: 'Anime', zh: '动漫' },
  architecture: { en: 'Architecture', zh: '建筑' },
  abstract: { en: 'Abstract', zh: '抽象' },
  photorealistic: { en: 'Photorealistic', zh: '写实' },
  'concept-art': { en: 'Concept Art', zh: '概念艺术' },
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; category?: string; model?: string }>;
};

export default async function PromptLibraryPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { search, category, model } = await searchParams;
  const isZh = locale === 'zh';

  const prompts = await getPrompts({
    search: search || undefined,
    category: category || undefined,
    model: model && model !== 'all' ? model : undefined,
    orderBy: 'created_at',
  });

  const hasFilters = !!(search || category || (model && model !== 'all'));
  const models = ['all', 'midjourney', 'stable-diffusion', 'dalle3', 'flux'];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="inline-flex rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-3.5 text-white shadow-lg shadow-purple-500/25">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {isZh ? '提示词库' : 'Prompt Library'}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {isZh ? `浏览 ${prompts.length} 个精选 AI 提示词` : `Browse ${prompts.length} curated AI prompts`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-4 mb-6 shadow-sm">
        <form className="relative flex-1 mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            name="search"
            defaultValue={search || ''}
            placeholder={isZh ? '搜索提示词...' : 'Search prompts...'}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </form>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <Link
            href={`/${locale}/prompt-library${model && model !== 'all' ? `?model=${model}` : ''}`}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              !category ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
            }`}
          >
            {isZh ? '全部' : 'All'}
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${locale}/prompt-library?category=${cat.slug}${model && model !== 'all' ? `&model=${model}` : ''}`}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                category === cat.slug ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {localizedLabel(catNames[cat.slug], locale)}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {models.map((m) => (
            <Link
              key={m}
              href={`/${locale}/prompt-library?${category ? `category=${category}&` : ''}${m !== 'all' ? `model=${m}` : ''}`}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${
                (model || 'all') === m ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {m === 'all' ? (isZh ? '全部' : 'All') : m === 'stable-diffusion' ? 'SD' : m}
            </Link>
          ))}
        </div>

        {hasFilters && (
          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Link href={`/${locale}/prompt-library`} className="text-xs text-zinc-400 hover:text-zinc-600">
              {isZh ? '清除所有筛选' : 'Clear all filters'}
            </Link>
          </div>
        )}
      </div>

      {/* Results */}
      {prompts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
          <Search className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-600" />
          <p className="mt-4 text-sm text-zinc-500">{isZh ? '没有找到匹配的提示词' : 'No prompts match your filters'}</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt: Prompt) => (
            <PromptCard
              key={prompt.id}
              title={localizedField(prompt, 'title', locale)}
              description={localizedField(prompt, 'description', locale)}
              model={prompt.model}
              likes={prompt.likes_count}
              views={prompt.views_count}
              tags={prompt.tags}
              slug={prompt.slug}
              locale={locale}
              promptText={prompt.prompt_text}
              coverImage={prompt.cover_image}
              galleryImages={prompt.gallery_images}
              isPremium={prompt.is_premium}
              isFeatured={prompt.is_featured}
            />
          ))}
        </div>
      )}
    </div>
  );
}
