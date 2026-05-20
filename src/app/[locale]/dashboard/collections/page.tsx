'use client';

import { useParams } from 'next/navigation';
import { FolderOpen, Plus } from 'lucide-react';

export default function CollectionsPage() {
  const { locale } = useParams<{ locale: string }>();
  const isZh = locale === 'zh';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isZh ? '我的合集' : 'My Collections'}</h1>
          <p className="text-zinc-500 mt-1">{isZh ? '整理你的提示词合集' : 'Organize your prompts into collections'}</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
          <Plus className="h-4 w-4" />{isZh ? '新建合集' : 'New Collection'}
        </button>
      </div>
      <div className="glass rounded-2xl p-12 text-center">
        <FolderOpen className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
        <h3 className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">{isZh ? '暂无合集' : 'No collections yet'}</h3>
        <p className="mt-1 text-sm text-zinc-500">{isZh ? '创建合集来分类整理你的提示词' : 'Create collections to organize your prompts'}</p>
      </div>
    </div>
  );
}
