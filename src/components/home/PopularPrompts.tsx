import Link from 'next/link';
import { Heart, Eye } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getPopularPrompts } from '@/lib/data';

export default async function PopularPrompts({ locale }: { locale: string }) {
  const t = await getTranslations();
  const isZh = locale === 'zh';
  const prompts = await getPopularPrompts(4);

  if (prompts.length === 0) return null;

  return (
    <section className="py-20 sm:py-24 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t('home.popularPrompts.title')}
          </h2>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            {t('home.popularPrompts.subtitle')}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {prompts.map((prompt) => {
            const title = isZh ? prompt.title_zh : prompt.title_en;
            return (
              <Link
                key={prompt.id}
                href={`/${locale}/prompt-library/${prompt.slug}`}
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:shadow-lg transition-all"
              >
                <p className="text-sm text-zinc-800 dark:text-zinc-200 font-mono leading-relaxed line-clamp-2">
                  {prompt.prompt_text}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {title}
                </h3>
                <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5">
                    {prompt.model === 'stable-diffusion' ? 'Stable Diffusion' : prompt.model === 'dalle3' ? 'DALL-E 3' : prompt.model.charAt(0).toUpperCase() + prompt.model.slice(1)}
                  </span>
                  <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {prompt.likes_count}</span>
                  <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {prompt.views_count}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/prompt-library`}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            {t('common.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
}
