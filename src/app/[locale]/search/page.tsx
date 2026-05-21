import { getPrompts, getBlogPosts } from '@/lib/data';
import { localizedField } from '@/lib/i18n-utils';
import Link from 'next/link';
import { Search, Sparkles, Heart, Eye, Calendar } from 'lucide-react';
import type { Prompt, BlogPost } from '@/types';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;
  const isZh = locale === 'zh';

  if (!q || q.trim() === '') {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">{isZh ? '搜索' : 'Search'}</h1>
        <form className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input name="q" placeholder={isZh ? '搜索提示词、博客...' : 'Search prompts, blog posts...'} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" autoFocus />
        </form>
      </div>
    );
  }

  const prompts = await getPrompts({ search: q, limit: 12 });
  const posts = await getBlogPosts(locale);
  const matchingPosts = posts.filter((p: BlogPost) => {
    const title = localizedField(p, 'title', locale);
    const excerpt = localizedField(p, 'excerpt', locale);
    return title.toLowerCase().includes(q.toLowerCase()) || (excerpt && excerpt.toLowerCase().includes(q.toLowerCase()));
  }).slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
        {isZh ? `搜索：${q}` : `Search: ${q}`}
      </h1>
      <p className="text-zinc-500 mb-8">
        {isZh ? `找到 ${prompts.length} 个提示词，${matchingPosts.length} 篇博客` : `Found ${prompts.length} prompts, ${matchingPosts.length} blog posts`}
      </p>

      {/* Prompts */}
      {prompts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
            <Sparkles className="h-4 w-4 inline mr-2" />{isZh ? '提示词' : 'Prompts'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((p: Prompt) => (
              <Link key={p.id} href={`/${locale}/prompt-library/${p.slug}`} className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:shadow-lg transition-all">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-indigo-600 transition-colors">{localizedField(p, 'title', locale)}</h3>
                <p className="mt-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 line-clamp-2">{p.prompt_text}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {p.likes_count}</span>
                  <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {p.views_count}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Blog posts */}
      {matchingPosts.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
            <Calendar className="h-4 w-4 inline mr-2" />{isZh ? '博客' : 'Blog Posts'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchingPosts.map((p: BlogPost) => (
              <Link key={p.slug} href={`/${locale}/blog/${p.slug}`} className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:shadow-md transition-all">
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1 group-hover:text-indigo-600 transition-colors">{localizedField(p, 'title', locale)}</h3>
                <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{localizedField(p, 'excerpt', locale)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
