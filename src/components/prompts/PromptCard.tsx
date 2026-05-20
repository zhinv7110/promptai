'use client';

import Link from 'next/link';
import { Heart, Eye, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'next/navigation';

interface PromptCardProps {
  title: string;
  model: string;
  likes: number;
  views: number;
  tags: string[];
  slug: string;
}

export default function PromptCard({ title, model, likes, views, tags, slug }: PromptCardProps) {
  const { locale } = useParams<{ locale: string }>();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/${locale}/prompt-library/${slug}`} className="flex-1">
          <p className="text-sm text-zinc-800 dark:text-zinc-200 font-mono leading-relaxed hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">
            {title}
          </p>
        </Link>
        <button
          onClick={handleCopy}
          className="shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400">
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 font-medium">
          {model}
        </span>
        <span className="inline-flex items-center gap-1">
          <Heart className="h-3 w-3" /> {likes}
        </span>
        <span className="inline-flex items-center gap-1">
          <Eye className="h-3 w-3" /> {views}
        </span>
      </div>
    </div>
  );
}
