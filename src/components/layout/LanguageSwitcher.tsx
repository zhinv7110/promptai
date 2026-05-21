'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { locales } from '@/i18n/routing';
import { languageName } from '@/lib/i18n-utils';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLocale =
    locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)) || 'en';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchTo = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    router.push(segments.join('/'));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="Switch language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="text-xs font-semibold uppercase">{currentLocale}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-lg py-1 z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchTo(loc)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                loc === currentLocale
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-medium'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span className="text-xs font-semibold uppercase w-6 inline-block">{loc}</span>
              <span className="text-zinc-500 dark:text-zinc-400">{languageName(loc)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
