import { getPrompts } from '@/lib/data';
import Link from 'next/link';
import { Heart, Eye, Sparkles } from 'lucide-react';
import type { Prompt } from '@/types';

const catNames: Record<string, { en: string; zh: string }> = {
  portrait: { en: 'Portrait', zh: '人像' }, landscape: { en: 'Landscape', zh: '风景' },
  fantasy: { en: 'Fantasy', zh: '奇幻' }, anime: { en: 'Anime', zh: '动漫' },
  architecture: { en: 'Architecture', zh: '建筑' }, abstract: { en: 'Abstract', zh: '抽象' },
  photorealistic: { en: 'Photorealistic', zh: '写实' }, 'concept-art': { en: 'Concept Art', zh: '概念艺术' },
};

type Props = { params: Promise<{ slug: string; locale: string }> };

export default async function CategoryPage({ params }: Props) {
  const { slug, locale } = await params;
  const prompts = await getPrompts({ category: slug, orderBy: 'likes_count' });
  const cat = catNames[slug];
  const name = cat ? (locale === 'zh' ? cat.zh : cat.en) : slug;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="inline-flex rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-3.5 text-white shadow-lg"><Sparkles className="h-6 w-6" /></div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{name}</h1>
          <p className="text-zinc-500">{locale === 'zh' ? `${prompts.length} 个提示词` : `${prompts.length} prompts`}</p>
        </div>
      </div>
      {prompts.length === 0 ? (
        <p className="text-zinc-500 text-center py-12">{locale === 'zh' ? '暂无内容' : 'No prompts in this category'}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((p: Prompt) => (
            <Link key={p.id} href={`/${locale}/prompt-library/${p.slug}`} className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:shadow-lg transition-all">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-purple-600 transition-colors">{locale === 'zh' ? p.title_zh : p.title_en}</h3>
              <p className="mt-3 text-xs font-mono text-zinc-600 dark:text-zinc-400 line-clamp-2">{p.prompt_text}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
                <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {p.likes_count}</span>
                <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {p.views_count}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
