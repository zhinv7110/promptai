'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Search, Sparkles, Wand2, Palette, ScanEye, ShieldX, FileText, BookOpen, ArrowRight } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  zh: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  category: string;
}

export function CommandPalette() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const isZh = locale === 'zh';
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);

  const commands: CommandItem[] = [
    { id: 'prompt-generator', label: 'Prompt Generator', zh: '提示词生成器', icon: Sparkles, href: '/prompt-generator', category: 'Tools' },
    { id: 'prompt-enhancer', label: 'Prompt Enhancer', zh: '提示词增强器', icon: Wand2, href: '/prompt-enhancer', category: 'Tools' },
    { id: 'style-generator', label: 'Style Generator', zh: '风格生成器', icon: Palette, href: '/style-generator', category: 'Tools' },
    { id: 'image-analyzer', label: 'Image Analyzer', zh: '图像分析器', icon: ScanEye, href: '/image-analyzer', category: 'Tools' },
    { id: 'negative-prompt', label: 'Negative Prompt', zh: '负面提示词', icon: ShieldX, href: '/negative-prompt', category: 'Tools' },
    { id: 'prompt-library', label: 'Prompt Library', zh: '提示词库', icon: FileText, href: '/prompt-library', category: 'Browse' },
    { id: 'blog', label: 'Blog', zh: '博客', icon: BookOpen, href: '/blog', category: 'Browse' },
    { id: 'tools', label: 'All Tools', zh: '全部工具', icon: Sparkles, href: '/tools', category: 'Browse' },
  ];

  const filtered = query
    ? commands.filter((c) => {
        const q = query.toLowerCase();
        return c.label.toLowerCase().includes(q) || c.zh.includes(q) || c.category.toLowerCase().includes(q);
      })
    : commands;

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (!open) return;
      if (e.key === 'Escape') { setOpen(false); setQuery(''); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && filtered[selectedIdx]) {
        e.preventDefault();
        router.push(`/${locale}${filtered[selectedIdx].href}`);
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, selectedIdx, filtered, locale, router]);

  useEffect(() => { setSelectedIdx(0); }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-start justify-center pt-[15vh]" onClick={() => { setOpen(false); setQuery(''); }}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-[9999] w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <Search className="h-4 w-4 text-zinc-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isZh ? '搜索工具和页面...' : 'Search tools & pages...'}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400 font-mono">⌘K</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-zinc-400 py-8">{isZh ? '没有匹配结果' : 'No results'}</p>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.id}
                onClick={() => { router.push(`/${locale}${item.href}`); setOpen(false); setQuery(''); }}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  i === selectedIdx ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
                onMouseEnter={() => setSelectedIdx(i)}
              >
                <item.icon className="h-4 w-4 text-zinc-400 shrink-0" />
                <div className="flex-1">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{isZh ? item.zh : item.label}</span>
                  <span className="ml-2 text-xs text-zinc-400">{item.category}</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-300" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
