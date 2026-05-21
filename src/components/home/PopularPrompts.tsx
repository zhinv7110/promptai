import Link from 'next/link';
import { Heart, Eye, Sparkles, TrendingUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getPrompts } from '@/lib/data';
import { localizedField } from '@/lib/i18n-utils';
import type { Prompt } from '@/types';

export default async function PopularPrompts({ locale }: { locale: string }) {
  const t = await getTranslations();
  const isZh = locale === 'zh';
  const featured = await getPrompts({ limit: 4, orderBy: 'likes_count' });
  const trending = await getPrompts({ limit: 4, orderBy: 'views_count' });

  return (
    <>
      {/* Featured */}
      <section className="py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {isZh ? '精选提示词' : 'Featured Prompts'}
            </h2>
          </div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10">
            {isZh ? '社区最受欢迎的 AI 图像提示词' : 'Most loved AI image prompts by the community'}
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 stagger">
            {featured.map((prompt: Prompt) => {
              const title = localizedField(prompt, 'title', locale);
              const desc = localizedField(prompt, 'description', locale);
              return (
                <Link key={prompt.id} href={`/${locale}/prompt-library/${prompt.slug}`}
                  className="group glass rounded-2xl overflow-hidden glass-hover flex flex-col"
                >
                  <div className="h-32 bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-xs text-white font-medium">{prompt.model}</span>
                      {prompt.is_premium && <span className="px-2 py-0.5 rounded-md bg-amber-400/80 text-xs text-amber-900 font-medium">★</span>}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{title}</h3>
                    {desc && <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{desc}</p>}
                    <p className="mt-2 text-xs font-mono text-zinc-400 line-clamp-2 flex-1">{prompt.prompt_text}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" />{prompt.likes_count}</span>
                      <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{prompt.views_count}</span>
                      <span className="ml-auto text-purple-500 font-medium group-hover:translate-x-0.5 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-20 sm:py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-cyan-500" />
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {isZh ? '热门趋势' : 'Trending Now'}
            </h2>
          </div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10">
            {isZh ? '正在被大量浏览的提示词' : 'Prompts getting the most attention right now'}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger">
            {trending.map((prompt: Prompt) => {
              const title = localizedField(prompt, 'title', locale);
              return (
                <Link key={prompt.id} href={`/${locale}/prompt-library/${prompt.slug}`}
                  className="group glass rounded-2xl p-5 glass-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-xs font-medium text-cyan-700 dark:text-cyan-400">{prompt.model}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-zinc-400"><Eye className="h-3 w-3" />{prompt.views_count}</span>
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-cyan-600 transition-colors">{title}</h3>
                  <p className="mt-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">{prompt.prompt_text}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {prompt.tags?.slice(0, 3).map((t: string) => (
                      <span key={t} className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-500">{t}</span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* View all */}
      <div className="py-8 text-center">
        <Link href={`/${locale}/prompt-library`}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 px-5 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          {t('common.viewAll')} →
        </Link>
      </div>
    </>
  );
}
