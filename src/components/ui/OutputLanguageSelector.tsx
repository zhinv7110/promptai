'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { type OutputLang, getOutputLang, saveOutputLang } from '@/lib/language';

const OPTIONS: { value: OutputLang; label: string; zh: string }[] = [
  { value: 'en', label: 'English', zh: '英文' },
  { value: 'zh', label: '中文解释', zh: '中文解释' },
  { value: 'bilingual', label: 'Bilingual', zh: '双语' },
];

export function OutputLanguageSelector({
  value,
  onChange,
  locale,
}: {
  value: OutputLang;
  onChange: (v: OutputLang) => void;
  locale: string;
}) {
  const isZh = locale === 'zh';
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-3.5 w-3.5 text-zinc-400" />
      <div className="flex rounded-lg bg-zinc-100 dark:bg-zinc-800 p-0.5">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { saveOutputLang(opt.value); onChange(opt.value); }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              value === opt.value
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            {isZh ? opt.zh : opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function useOutputLang(locale: string): [OutputLang, (v: OutputLang) => void] {
  const [lang, setLang] = useState<OutputLang>(() => {
    const saved = getOutputLang();
    if (saved) return saved;
    return locale === 'zh' ? 'bilingual' : 'en';
  });

  useEffect(() => { saveOutputLang(lang); }, [lang]);

  return [lang, setLang];
}
