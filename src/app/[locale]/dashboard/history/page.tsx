'use client';

import { useParams } from 'next/navigation';
import { Clock } from 'lucide-react';

export default function HistoryPage() {
  const { locale } = useParams<{ locale: string }>();
  const isZh = locale === 'zh';

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{isZh ? '使用历史' : 'History'}</h1>
      <p className="text-zinc-500 mb-8">{isZh ? '你生成的提示词和操作记录' : 'Your prompt generation and activity history'}</p>
      <div className="glass rounded-2xl p-12 text-center">
        <Clock className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
        <h3 className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">{isZh ? '暂无历史' : 'No history yet'}</h3>
        <p className="mt-1 text-sm text-zinc-500">{isZh ? '使用工具生成提示词后会自动记录' : 'Your activity will appear here automatically'}</p>
      </div>
    </div>
  );
}
