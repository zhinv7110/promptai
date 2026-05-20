'use client';

import Link from 'next/link';
import { Sparkles, Wand2, Palette, ScanEye, ShieldX, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TOOLS } from '@/lib/constants';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Wand2, Palette, ScanEye, ShieldX,
};

export default function PopularTools({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t('home.popularTools.title')}
          </h2>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            {t('home.popularTools.subtitle')}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger">
          {TOOLS.map((tool) => {
            const Icon = icons[tool.icon];
            return (
              <Link
                key={tool.id}
                href={`/${locale}${tool.href}`}
                className="group glass rounded-2xl p-6 glass-hover"
              >
                <div className={`inline-flex rounded-xl bg-gradient-to-br ${tool.color} p-3 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {t(`tools.${tool.tKey}.name`)}
                </h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {t(`tools.${tool.tKey}.description`)}
                </p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                  {locale === 'zh' ? '立即使用' : 'Try it now'}
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
