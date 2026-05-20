'use client';

import Link from 'next/link';
import { ArrowRight, Search, Sparkles, Zap, Wand2, Palette, ScanEye, ShieldX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero({ locale }: { locale: string }) {
  const t = useTranslations('home.hero');
  const isZh = locale === 'zh';
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q') as string;
    if (q.trim()) router.push(`/${locale}/search?q=${encodeURIComponent(q.trim())}`);
  };

  const stats = [
    { count: '8', label: isZh ? 'AI 工具' : 'AI Tools', icon: Sparkles },
    { count: '8', label: isZh ? '精选提示词' : 'Curated Prompts', icon: Zap },
    { count: '3', label: isZh ? '教程指南' : 'Tutorials', icon: Wand2 },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-cyan-500/4 to-transparent dark:from-indigo-500/15 dark:via-cyan-500/8" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="animate-slide-down inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/50 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            {isZh ? '免费 AI 提示词工具平台' : 'Free AI Prompt Tools Platform'}
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="gradient-text">
              {isZh ? '创造完美的 AI 图像提示词' : 'Create Perfect AI Image Prompts'}
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto animate-fade-in">
            {isZh
              ? '免费工具集，为 Midjourney、Stable Diffusion 和 DALL-E 生成、增强和发现最佳提示词'
              : 'Generate, enhance, and discover the best prompts for Midjourney, Stable Diffusion, and DALL-E — all for free.'}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link
              href={`/${locale}/prompt-generator`}
              className="btn-press group inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 px-6 py-3.5 text-sm font-semibold text-white dark:text-zinc-900 shadow-xl shadow-zinc-900/20 dark:shadow-zinc-50/10 hover:shadow-2xl hover:scale-[1.02] transition-all"
            >
              <Sparkles className="h-4 w-4" />
              {t('cta.primary')}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href={`/${locale}/prompt-library`}
              className="btn-press inline-flex items-center gap-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 px-6 py-3.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
            >
              {t('cta.secondary')}
            </Link>
          </div>

          {/* Search */}
          <div className="mt-12 mx-auto max-w-xl animate-slide-up">
            <form onSubmit={handleSearch}>
              <div className={`flex items-center gap-2 rounded-2xl border-2 bg-white dark:bg-zinc-900 px-5 py-3.5 shadow-sm transition-all duration-300 ${
                searchFocused
                  ? 'border-indigo-400 dark:border-indigo-600 shadow-lg shadow-indigo-500/10'
                  : 'border-zinc-200 dark:border-zinc-800'
              }`}>
                <Search className="h-5 w-5 text-zinc-400 shrink-0" />
                <input
                  name="q"
                  type="text"
                  placeholder={t('search')}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-xs text-zinc-400 font-mono">⌘K</kbd>
              </div>
            </form>
          </div>

          {/* Stats */}
          <div className="mt-14 flex items-center justify-center gap-8 sm:gap-12 animate-fade-in">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center gap-1.5 justify-center">
                  <stat.icon className="h-4 w-4 text-indigo-500" />
                  <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stat.count}</span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-zinc-50/50 dark:from-zinc-950/50 to-transparent pointer-events-none" />
    </section>
  );
}
