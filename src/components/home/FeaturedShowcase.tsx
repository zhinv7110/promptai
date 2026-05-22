import Link from 'next/link';
import { Sparkles, Heart, Eye, Star, ArrowRight } from 'lucide-react';
import { getFeaturedPrompts } from '@/lib/data';
import { localizedField } from '@/lib/i18n-utils';
import type { Prompt } from '@/types';

export default async function FeaturedShowcase({ locale }: { locale: string }) {
  const isZh = locale === 'zh';
  const featured = await getFeaturedPrompts(8);

  if (featured.length === 0) return null;

  const hero = featured[0];
  const grid = featured.slice(1, 5);
  const list = featured.slice(5, 8);

  const heroTitle = localizedField(hero, 'title', locale);
  const heroDesc = localizedField(hero, 'description', locale);
  const modelLabel = (m: string) => m === 'stable-diffusion' ? 'SD' : m === 'dalle3' ? 'DALL·E 3' : m.charAt(0).toUpperCase() + m.slice(1);

  return (
    <section className="py-20 sm:py-28 section-atmosphere">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {isZh ? '精选 AI 创作' : 'Featured AI Creations'}
          </h2>
        </div>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10">
          {isZh ? '探索由社区精选的顶级 AI 图像作品及其提示词' : 'Explore top AI-generated artwork with their prompts, curated by the community'}
        </p>

        {/* Hero + Grid layout */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Hero card — spans 2 cols on lg */}
          <Link
            href={`/${locale}/prompt-library/${hero.slug}`}
            className="lg:col-span-2 group relative rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100 dark:bg-zinc-800 card-glow card-zoom min-h-[360px]"
          >
            {hero.cover_image ? (
              <>
                <img src={hero.cover_image} alt={heroTitle} className="parallax-image absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="gradient-overlay-bottom absolute inset-0 z-10" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500" />
            )}
            <div className="absolute inset-0 z-20 p-6 sm:p-8 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-xs text-white font-medium">{modelLabel(hero.model)}</span>
                {hero.is_premium && <span className="px-2 py-0.5 rounded-md bg-amber-400/80 text-xs text-amber-900 font-medium flex items-center gap-1"><Star className="h-2.5 w-2.5 fill-current" /> Premium</span>}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-1">{heroTitle}</h3>
              {heroDesc && <p className="text-white/80 text-sm drop-shadow line-clamp-2 max-w-xl">{heroDesc}</p>}
              <div className="flex items-center gap-4 mt-3 text-xs text-white/70">
                <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {hero.likes_count}</span>
                <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {hero.views_count}</span>
              </div>
            </div>
          </Link>

          {/* Side grid — 2x2 on lg */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-2">
            {grid.map((prompt) => {
              const t = localizedField(prompt, 'title', locale);
              return (
                <Link
                  key={prompt.id}
                  href={`/${locale}/prompt-library/${prompt.slug}`}
                  className="group relative rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100 dark:bg-zinc-800 card-glow min-h-[172px]"
                >
                  {prompt.cover_image ? (
                    <>
                      <img src={prompt.cover_image} alt={t} className="parallax-image absolute inset-0 w-full h-full object-cover" loading="lazy" />
                      <div className="gradient-overlay-bottom absolute inset-0 z-10" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
                  )}
                  <div className="absolute inset-0 z-20 p-4 flex flex-col justify-end">
                    <span className="self-start px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-sm text-xs text-white font-medium mb-2">{modelLabel(prompt.model)}</span>
                    <h4 className="text-sm font-semibold text-white drop-shadow line-clamp-2 leading-snug">{t}</h4>
                    <span className="text-xs text-white/60 mt-1 inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {prompt.likes_count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom row — smaller cards */}
        {list.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3 mt-4">
            {list.map((prompt) => {
              const t = localizedField(prompt, 'title', locale);
              const d = localizedField(prompt, 'description', locale);
              return (
                <Link
                  key={prompt.id}
                  href={`/${locale}/prompt-library/${prompt.slug}`}
                  className="group flex items-center gap-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 card-glow"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-purple-400 to-indigo-500">
                    {prompt.cover_image ? (
                      <img src={prompt.cover_image} alt={t} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Sparkles className="h-5 w-5 text-white/60" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{t}</h4>
                    {d && <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{d}</p>}
                    <span className="inline-flex items-center gap-1 text-xs text-zinc-400 mt-1"><Heart className="h-3 w-3" /> {prompt.likes_count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View all */}
        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/prompt-library`}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 px-5 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            {isZh ? '浏览全部提示词' : 'View All Prompts'} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
