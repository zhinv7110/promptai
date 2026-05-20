'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const toolLinks = [
  { href: '/prompt-generator', key: 'promptGenerator' },
  { href: '/prompt-enhancer', key: 'promptEnhancer' },
  { href: '/style-generator', key: 'styleGenerator' },
  { href: '/image-analyzer', key: 'imageAnalyzer' },
  { href: '/negative-prompt', key: 'negativePrompt' },
];

export default function Navigation({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = useTranslations();

  const linkClass = (href: string) =>
    cn(
      'text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400',
      pathname === `/${locale}${href}` || pathname.startsWith(`/${locale}${href}/`)
        ? 'text-indigo-600 dark:text-indigo-400'
        : 'text-zinc-600 dark:text-zinc-400'
    );

  return (
    <nav className="flex items-center gap-1">
      <Link href={`/${locale}`} className={cn(linkClass('/'), 'px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800')}>
        {t('nav.home')}
      </Link>

      <div className="relative group">
        <Link
          href={`/${locale}/tools`}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {t('nav.tools')}
          <ChevronDown className="h-3 w-3" />
        </Link>
        <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="p-2">
            {toolLinks.map((tool) => (
              <Link
                key={tool.href}
                href={`/${locale}${tool.href}`}
                className="block rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {t(`tools.${tool.key}.name`)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Link href={`/${locale}/prompt-library`} className={cn(linkClass('/prompt-library'), 'px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800')}>
        {t('nav.promptLibrary')}
      </Link>
      <Link href={`/${locale}/blog`} className={cn(linkClass('/blog'), 'px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800')}>
        {t('nav.blog')}
      </Link>
      <Link href={`/${locale}/about`} className={cn(linkClass('/about'), 'px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800')}>
        {t('nav.about')}
      </Link>
    </nav>
  );
}
