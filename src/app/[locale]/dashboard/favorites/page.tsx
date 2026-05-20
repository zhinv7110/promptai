'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, Sparkles } from 'lucide-react';

export default function FavoritesPage() {
  const { locale } = useParams<{ locale: string }>();
  const isZh = locale === 'zh';

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{isZh ? '我的收藏' : 'My Favorites'}</h1>
      <p className="text-zinc-500 mb-8">{isZh ? '你收藏的提示词' : 'Your saved prompts'}</p>
      <div className="glass rounded-2xl p-12 text-center">
        <Heart className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
        <h3 className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">{isZh ? '暂无收藏' : 'No favorites yet'}</h3>
        <p className="mt-1 text-sm text-zinc-500">{isZh ? '浏览提示词库，点击心形图标收藏' : 'Browse the library and heart your favorites'}</p>
        <Link href={`/${locale}/prompt-library`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
          <Sparkles className="h-4 w-4" />{isZh ? '浏览提示词库' : 'Browse Library'}
        </Link>
      </div>
    </div>
  );
}
