'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href={`/${locale}`} className="text-lg font-bold">
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                PromptAI
              </span>
            </Link>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              {t('footer.about')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {t('footer.tools')}
            </h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: 'prompt-generator', key: 'promptGenerator' },
                { href: 'prompt-enhancer', key: 'promptEnhancer' },
                { href: 'style-generator', key: 'styleGenerator' },
                { href: 'image-analyzer', key: 'imageAnalyzer' },
                { href: 'negative-prompt', key: 'negativePrompt' },
              ].map((tool) => (
                <li key={tool.key}>
                  <Link
                    href={`/${locale}/${tool.href}`}
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                  >
                    {t(`tools.${tool.key}.name`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {t('footer.resources')}
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href={`/${locale}/prompt-library`} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                  {t('nav.promptLibrary')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/tools`} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                  {t('nav.tools')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {t('footer.company')}
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href={`/${locale}/about`} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/pricing`} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                  {t('nav.pricing')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} PromptAI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href={`/${locale}`} className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400">
              {t('footer.privacy')}
            </Link>
            <Link href={`/${locale}`} className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
