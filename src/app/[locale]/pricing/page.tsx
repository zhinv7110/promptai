'use client';

import { useLocale } from 'next-intl';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const locale = useLocale();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {locale === 'zh' ? '定价方案' : 'Pricing'}
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
          {locale === 'zh' ? '选择最适合你的方案' : 'Choose the plan that works for you'}
        </p>
      </div>

      <div className="mt-12 mx-auto max-w-lg">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Free</h2>
          <p className="mt-4 text-5xl font-bold text-zinc-900 dark:text-zinc-50">$0</p>
          <p className="mt-2 text-sm text-zinc-500">{locale === 'zh' ? '免费开始使用' : 'Get started free'}</p>
          <ul className="mt-8 space-y-3 text-left">
            {[
              locale === 'zh' ? '所有基础工具' : 'All basic tools',
              locale === 'zh' ? '提示词库访问' : 'Prompt library access',
              locale === 'zh' ? '社区支持' : 'Community support',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Check className="h-4 w-4 text-green-500" /> {feature}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">
          {locale === 'zh' ? '更多高级方案即将推出' : 'Premium plans coming soon'}
        </p>
      </div>
    </div>
  );
}
