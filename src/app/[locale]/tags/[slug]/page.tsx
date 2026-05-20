import { getPrompts } from '@/lib/data';
import Link from 'next/link';
import { Heart, Eye, Tag } from 'lucide-react';
import type { Prompt } from '@/types';

type Props = { params: Promise<{ slug: string; locale: string }> };

export default async function TagPage({ params }: Props) {
  const { slug, locale } = await params;
  const prompts = await getPrompts({ tags: [slug], orderBy: 'likes_count' });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="inline-flex rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-3.5 text-white shadow-lg"><Tag className="h-6 w-6" /></div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">#{slug}</h1>
          <p className="text-zinc-500">{locale === 'zh' ? `${prompts.length} 个提示词` : `${prompts.length} prompts`}</p>
        </div>
      </div>
      {prompts.length === 0 ? (
        <p className="text-zinc-500 text-center py-12">{locale === 'zh' ? '暂无内容' : 'No prompts with this tag'}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((p: Prompt) => (
            <Link key={p.id} href={`/${locale}/prompt-library/${p.slug}`} className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:shadow-lg transition-all">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-cyan-600 transition-colors">{locale === 'zh' ? p.title_zh : p.title_en}</h3>
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
