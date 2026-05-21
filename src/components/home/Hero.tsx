'use client';

import Link from 'next/link';
import { ArrowRight, Search, Sparkles, Zap, Wand2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMouseGlow } from '@/hooks/useMouseGlow';
import HeroBackground from './HeroBackground';

export default function Hero({ locale }: { locale: string }) {
  const t = useTranslations('home.hero');
  const router = useRouter();
  const sectionRef = useMouseGlow();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q') as string;
    if (q.trim()) router.push(`/${locale}/search?q=${encodeURIComponent(q.trim())}`);
  };

  const stats = [
    { count: '8', label: t('tools'), icon: Sparkles },
    { count: '8', label: t('curated'), icon: Zap },
    { count: '3', label: t('tutorials'), icon: Wand2 },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] overflow-hidden flex items-center"
    >
      <HeroBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="animate-slide-down inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white/60 mb-10">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            {t('badge')}
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="gradient-text">{t('title')}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed text-zinc-300/80">
            {t('subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link
              href={`/${locale}/prompt-generator`}
              className="btn-premium group"
            >
              <Sparkles className="h-5 w-5" />
              {t('cta.primary')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href={`/${locale}/prompt-library`}
              className="btn-glass"
            >
              {t('cta.secondary')}
            </Link>
          </div>

          {/* Search */}
          <div className="mt-12 mx-auto max-w-xl animate-slide-up">
            <form onSubmit={handleSearch}>
              <div className="search-glass">
                <Search className="h-5 w-5 text-white/30 shrink-0" />
                <input
                  name="q"
                  type="text"
                  placeholder={t('search')}
                />
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md bg-white/5 px-2 py-1 text-xs text-white/25 font-mono">⌘K</kbd>
              </div>
            </form>
          </div>

          {/* Stats */}
          <div className="mt-16 flex items-center justify-center gap-8 sm:gap-12 animate-fade-in">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center gap-1.5 justify-center">
                  <stat.icon className="h-4 w-4 text-indigo-400/70" />
                  <span className="text-2xl font-bold text-white/90">{stat.count}</span>
                </div>
                <p className="mt-1 text-xs text-zinc-400/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
