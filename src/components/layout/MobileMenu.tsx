'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const toolLinks = [
  { href: '/prompt-generator', key: 'promptGenerator' },
  { href: '/prompt-enhancer', key: 'promptEnhancer' },
  { href: '/style-generator', key: 'styleGenerator' },
  { href: '/image-analyzer', key: 'imageAnalyzer' },
  { href: '/negative-prompt', key: 'negativePrompt' },
];

export default function MobileMenu({ locale, onClose }: { locale: string; onClose: () => void }) {
  const pathname = usePathname();
  const t = useTranslations();

  const isActive = (href: string) =>
    pathname === `/${locale}${href}`;

  return (
    <div className="md:hidden fixed inset-0 top-16 z-40 bg-white dark:bg-zinc-950">
      <div className="h-full overflow-y-auto px-4 py-6">
        <nav className="flex flex-col gap-1">
          <Link
            href={`/${locale}`}
            onClick={onClose}
            className={cn(
              'rounded-lg px-3 py-2.5 text-base font-medium',
              isActive('/') ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50' : 'text-zinc-600 dark:text-zinc-400'
            )}
          >
            {t('nav.home')}
          </Link>

          <div className="mt-2 mb-1 px-3 text-xs font-semibold uppercase text-zinc-400 dark:text-zinc-500">
            {t('nav.tools')}
          </div>
          {toolLinks.map((tool) => (
            <Link
              key={tool.href}
              href={`/${locale}${tool.href}`}
              onClick={onClose}
              className={cn(
                'rounded-lg px-3 py-2.5 text-base font-medium pl-6',
                isActive(tool.href) ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50' : 'text-zinc-600 dark:text-zinc-400'
              )}
            >
              {t(`tools.${tool.key}.name`)}
            </Link>
          ))}

          <div className="mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-4 flex flex-col gap-1">
            <Link href={`/${locale}/prompt-library`} onClick={onClose}
              className="rounded-lg px-3 py-2.5 text-base font-medium text-zinc-600 dark:text-zinc-400">
              {t('nav.promptLibrary')}
            </Link>
            <Link href={`/${locale}/blog`} onClick={onClose}
              className="rounded-lg px-3 py-2.5 text-base font-medium text-zinc-600 dark:text-zinc-400">
              {t('nav.blog')}
            </Link>
            <Link href={`/${locale}/about`} onClick={onClose}
              className="rounded-lg px-3 py-2.5 text-base font-medium text-zinc-600 dark:text-zinc-400">
              {t('nav.about')}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
