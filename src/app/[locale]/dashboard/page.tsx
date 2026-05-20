'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Sparkles, Heart, Clock, FolderOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { locale } = useParams<{ locale: string }>();
  const { user } = useAuth();
  const isZh = locale === 'zh';

  const stats = [
    { label: isZh ? '收藏' : 'Favorites', value: '-', icon: Heart, href: 'favorites', color: 'from-pink-500 to-rose-600' },
    { label: isZh ? '历史' : 'History', value: '-', icon: Clock, href: 'history', color: 'from-cyan-500 to-blue-600' },
    { label: isZh ? '合集' : 'Collections', value: '-', icon: FolderOpen, href: 'collections', color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {isZh ? '欢迎回来' : 'Welcome back'}{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h1>
        <p className="text-zinc-500 mt-1">{isZh ? '你的 AI 提示词仪表盘' : 'Your AI prompt dashboard'}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        {stats.map((s) => (
          <Link key={s.href} href={`/${locale}/dashboard/${s.href}`} className="glass rounded-2xl p-5 glass-hover">
            <div className={`inline-flex rounded-xl bg-gradient-to-br ${s.color} p-2.5 text-white`}><s.icon className="h-5 w-5" /></div>
            <div className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{s.value}</div>
            <div className="text-sm text-zinc-500">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={`/${locale}/prompt-generator`} className="glass rounded-2xl p-5 glass-hover flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-indigo-500" /><span className="font-semibold text-zinc-900 dark:text-zinc-50">{isZh ? '生成提示词' : 'Generate Prompts'}</span></div>
            <p className="text-sm text-zinc-500 mt-1">{isZh ? '使用工具创建提示词' : 'Create prompts with our tools'}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-400" />
        </Link>
        <Link href={`/${locale}/prompt-library`} className="glass rounded-2xl p-5 glass-hover flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2"><FolderOpen className="h-5 w-5 text-amber-500" /><span className="font-semibold text-zinc-900 dark:text-zinc-50">{isZh ? '浏览提示词库' : 'Browse Library'}</span></div>
            <p className="text-sm text-zinc-500 mt-1">{isZh ? '发现精选提示词' : 'Discover curated prompts'}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-400" />
        </Link>
      </div>
    </div>
  );
}
