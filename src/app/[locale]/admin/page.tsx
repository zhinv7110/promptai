'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FileText, BookOpen, Upload, ArrowRight, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const { locale } = useParams<{ locale: string }>();
  const isZh = locale === 'zh';

  const cards = [
    { href: `/${locale}/admin/prompts`, icon: FileText, title: isZh ? '提示词管理' : 'Prompts', desc: isZh ? '创建、编辑和管理 AI 提示词' : 'Create, edit and manage AI prompts', color: 'from-indigo-500 to-purple-600' },
    { href: `/${locale}/admin/blog`, icon: BookOpen, title: isZh ? '博客管理' : 'Blog', desc: isZh ? '撰写和发布博客文章' : 'Write and publish blog posts', color: 'from-cyan-500 to-blue-600' },
    { href: `/${locale}/admin/import`, icon: Upload, title: isZh ? '批量导入' : 'Import', desc: isZh ? 'CSV/JSON 批量导入' : 'CSV/JSON bulk import', color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isZh ? '管理后台' : 'Admin Dashboard'}</h1>
        <p className="text-zinc-500 mt-1">{isZh ? '管理你的 Thaumary 内容' : 'Manage your Thaumary content'}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all">
            <div className={`inline-flex rounded-xl bg-gradient-to-br ${card.color} p-3 text-white`}><card.icon className="h-6 w-6" /></div>
            <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{card.title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{card.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">{isZh ? '进入' : 'Open'} <ArrowRight className="h-3.5 w-3.5" /></span>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href={`/${locale}/admin/prompts/new`} className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
          <Plus className="h-5 w-5 text-indigo-500" />
          <div><span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{isZh ? '新建提示词' : 'New Prompt'}</span><p className="text-xs text-zinc-400">{isZh ? '快速创建一条提示词' : 'Quickly create a prompt'}</p></div>
        </Link>
        <Link href={`/${locale}/admin/blog/new`} className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-cyan-200 dark:hover:border-cyan-800 transition-colors">
          <Plus className="h-5 w-5 text-cyan-500" />
          <div><span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{isZh ? '新建博客' : 'New Blog Post'}</span><p className="text-xs text-zinc-400">{isZh ? '快速创建一篇博客' : 'Quickly create a blog post'}</p></div>
        </Link>
      </div>
    </div>
  );
}
