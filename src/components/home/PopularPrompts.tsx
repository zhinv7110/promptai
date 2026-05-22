import Link from 'next/link';
import { Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getPrompts } from '@/lib/data';
import { localizedField } from '@/lib/i18n-utils';
import PromptCard from '@/components/prompts/PromptCard';
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
            {featured.map((prompt: Prompt) => (
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

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 stagger">
            {trending.map((prompt: Prompt) => (
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
        </div>
      </section>

      {/* View all */}
      <div className="py-8 text-center">
        <Link href={`/${locale}/prompt-library`}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 px-5 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          {t('common.viewAll')} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
