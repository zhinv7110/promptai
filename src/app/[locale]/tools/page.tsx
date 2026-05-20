'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { TOOLS } from '@/lib/constants';
import ToolCard from '@/components/tools/ToolCard';

export default function ToolsPage() {
  const t = useTranslations();
  const { locale } = useParams<{ locale: string }>();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        {t('nav.tools')}
      </h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        {locale === 'zh'
          ? '探索我们的免费 AI 图像提示词工具集'
          : 'Explore our collection of free AI image prompt tools'}
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} {...tool} />
        ))}
      </div>
    </div>
  );
}
