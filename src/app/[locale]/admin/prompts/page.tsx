'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const CATEGORIES = ['portrait','landscape','fantasy','anime','architecture','abstract','photorealistic','concept-art'];

export default function AdminPromptsPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const isZh = locale === 'zh';

  const [prompts, setPrompts] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    params.set('page', String(page));
    params.set('perPage', '15');

    const res = await fetch(`/api/admin/prompts?${params}`);
    const data = await res.json();
    setPrompts(data.data || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [search, category, page]);

  useEffect(() => { fetchPrompts(); }, [fetchPrompts]);

  const handleDelete = async (id: string) => {
    if (!confirm(isZh ? '确定删除？' : 'Confirm delete?')) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/prompts?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPrompts((prev) => prev.filter((p) => p.id !== id));
      setTotal((t) => t - 1);
    }
    setDeleting(null);
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {isZh ? '提示词管理' : 'Prompts'}
          <span className="ml-2 text-sm font-normal text-zinc-400">({total})</span>
        </h1>
        <Link
          href={`/${locale}/admin/prompts/new`}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          <Plus className="h-4 w-4" /> {isZh ? '新建' : 'New'}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={isZh ? '搜索...' : 'Search...'}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="">{isZh ? '全部分类' : 'All categories'}</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-zinc-400" /></div>
        ) : prompts.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">{isZh ? '暂无数据' : 'No prompts found'}</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 uppercase">
                <th className="text-left p-4 font-medium">{isZh ? '标题' : 'Title'}</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">{isZh ? '分类' : 'Category'}</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">{isZh ? '模型' : 'Model'}</th>
                <th className="text-right p-4 font-medium">{isZh ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {prompts.map((p) => (
                <tr key={p.id as string} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="p-4">
                    <button onClick={() => router.push(`/${locale}/admin/prompts/${p.id}`)} className="text-left">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 line-clamp-1 hover:text-indigo-600">{p.title_en as string}</p>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{p.title_zh as string}</p>
                    </button>
                  </td>
                  <td className="p-4 hidden sm:table-cell"><span className="text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5">{p.category as string}</span></td>
                  <td className="p-4 hidden md:table-cell"><span className="text-xs text-zinc-500">{p.model as string}</span></td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => router.push(`/${locale}/admin/prompts/${p.id}`)} className="p-2 rounded-lg text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(p.id as string)} disabled={deleting === p.id} className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                        {deleting === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-zinc-500">
            {isZh ? `第 ${page} 页，共 ${totalPages} 页` : `Page ${page} of ${totalPages}`}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
