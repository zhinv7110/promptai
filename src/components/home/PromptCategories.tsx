'use client';

import Link from 'next/link';
import { User, Mountain, Sword, Drama, Building2, Shapes, Camera, PenLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/constants';

const catIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  User, Landscape: Mountain, Sword, Drama, Building: Building2, Shapes, Camera, PenLine,
};

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

export default function PromptCategories() {
  const t = useTranslations();
  const { locale } = useParams<{ locale: string }>();
  const isZh = locale === 'zh';

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t('home.categories.title')}
          </h2>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            {t('home.categories.subtitle')}
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = catIcons[cat.icon];
            const name = catNames[cat.slug];
            return (
              <Link
                key={cat.slug}
                href={`/${locale}/prompt-library?category=${cat.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all shadow-sm"
              >
                {Icon && <Icon className="h-4 w-4" />}
                {isZh ? name.zh : name.en}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
