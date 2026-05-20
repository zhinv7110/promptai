'use client';

import { useTranslations } from 'next-intl';
import { Sparkles, Wand2, Palette, ScanEye, ShieldX } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TOOLS } from '@/lib/constants';
import type { ReactNode } from 'react';
import React from 'react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Wand2, Palette, ScanEye, ShieldX,
};

export default function ToolLayout({ toolId, children }: { toolId: string; children: ReactNode }) {
  const t = useTranslations();
  const { locale } = useParams<{ locale: string }>();
  const tool = TOOLS.find((t) => t.id === toolId)!;
  const Icon = iconMap[tool.icon];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className={`inline-flex rounded-xl bg-gradient-to-br ${tool.color} p-3 text-white`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {t(`tools.${tool.tKey}.name`)}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {t(`tools.${tool.tKey}.description`)}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
