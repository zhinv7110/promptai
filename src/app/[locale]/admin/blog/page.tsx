'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminBlogPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const isZh = locale === 'zh';

  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ search, page: String(page), perPage: '15' });
    const res = await fetch(`/api/admin/blog?${params}`);
    const data = await res.json();
    setPosts(data.data || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    if (!confirm(isZh ? '确定删除？' : 'Confirm delete?')) return;
    await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setTotal((t) => t - 1);
  };

  const handleTogglePublished = async (post: Record<string, unknown>) => {
    await fetch(`/api/admin/blog?id=${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    });
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, published: !post.published } : p));
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {isZh ? '博客管理' : 'Blog'} <span className="ml-2 text-sm font-normal text-zinc-400">({total})</span>
        </h1>
        <Link href={`/${locale}/admin/blog/new`} className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
          <Plus className="h-4 w-4" /> {isZh ? '新建' : 'New'}
        </Link>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder={isZh ? '搜索...' : 'Search...'} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-zinc-400" /></div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">{isZh ? '暂无文章' : 'No posts found'}</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 uppercase">
                <th className="text-left p-4 font-medium">{isZh ? '标题' : 'Title'}</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">{isZh ? '状态' : 'Status'}</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">{isZh ? '日期' : 'Date'}</th>
                <th className="text-right p-4 font-medium">{isZh ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {posts.map((p) => (
                <tr key={p.id as string} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="p-4">
                    <button onClick={() => router.push(`/${locale}/admin/blog/${p.id}`)} className="text-left">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 line-clamp-1 hover:text-cyan-600">{p.title_en as string}</p>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{p.title_zh as string}</p>
                    </button>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <button onClick={() => handleTogglePublished(p)} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${p.published ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                      {p.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {p.published ? (isZh ? '已发布' : 'Published') : (isZh ? '草稿' : 'Draft')}
                    </button>
                  </td>
                  <td className="p-4 hidden md:table-cell text-sm text-zinc-500">{(p.created_at as string)?.split('T')[0]}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => router.push(`/${locale}/admin/blog/${p.id}`)} className="p-2 rounded-lg text-zinc-400 hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(p.id as string)} className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-zinc-500">{isZh ? `第 ${page} 页，共 ${totalPages} 页` : `Page ${page} of ${totalPages}`}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
