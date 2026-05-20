'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Wand2, Palette, ScanEye, ShieldX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import React from 'react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Wand2, Palette, ScanEye, ShieldX,
};

interface ToolCardProps {
  tKey: string;
  icon: string;
  color: string;
  href: string;
}

export default function ToolCard({ tKey, icon, color, href }: ToolCardProps) {
  const t = useTranslations();
  const { locale } = useParams<{ locale: string }>();
  const Icon = iconMap[icon];

  return (
    <Link
      href={`/${locale}${href}`}
      className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all"
    >
      <div className={`inline-flex rounded-xl bg-gradient-to-br ${color} p-3 text-white`}>
        {Icon && <Icon className="h-6 w-6" />}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {t(`tools.${tKey}.name`)}
      </h3>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        {t(`tools.${tKey}.description`)}
      </p>
      <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
        Try it now <ArrowRight className="ml-1 h-3 w-3 group-hover:ml-2 transition-all" />
      </div>
    </Link>
  );
}
