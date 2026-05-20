import Link from 'next/link';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getBlogPosts } from '@/lib/data';

export default async function LatestArticles({ locale }: { locale: string }) {
  const t = await getTranslations();
  const isZh = locale === 'zh';
  const posts = (await getBlogPosts(locale)).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t('home.latestArticles.title')}
            </h2>
            <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
              {t('home.latestArticles.subtitle')}
            </p>
          </div>
          <Link
            href={`/${locale}/blog`}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {t('common.viewAll')} <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const title = isZh ? post.title_zh : post.title_en;
            return (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all"
              >
                <div className="h-40 rounded-xl bg-gradient-to-br from-indigo-400 via-purple-400 to-cyan-400 dark:from-indigo-600 dark:via-purple-600 dark:to-cyan-600 flex items-center justify-center mb-4">
                  <span className="text-4xl opacity-30">
                    {post.tags?.includes('beginner') || post.tags?.includes('入门') ? '🌱' : post.tags?.includes('advanced') || post.tags?.includes('进阶') ? '🚀' : '🎨'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Calendar className="h-3 w-3" />
                  {post.date?.split('T')[0] || ''}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {title}
                </h3>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400"
          >
            {t('common.viewAll')} <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
