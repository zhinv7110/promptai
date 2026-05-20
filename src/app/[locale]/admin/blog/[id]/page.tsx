'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function EditBlogPage() {
  const { locale, id } = useParams<{ locale: string; id: string }>();
  const router = useRouter();
  const isZh = locale === 'zh';

  const [form, setForm] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<'en' | 'zh' | null>(null);

  useEffect(() => {
    fetch(`/api/admin/blog?id=${id}`).then((r) => r.json()).then((data) => {
      if (data) setForm({ ...data, tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || '') });
      setLoading(false);
    });
  }, [id]);

  const h = (f: string, v: string | boolean) => setForm((prev) => ({ ...prev, [f]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/admin/blog?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, tags: typeof form.tags === 'string' ? (form.tags as string).split(',').map((t) => t.trim()).filter(Boolean) : form.tags }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) router.push(`/${locale}/admin/blog`);
    else setError(data.error || 'Save failed');
  };

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-zinc-400" /></div>;

  const F = ({ l, z, r, children: c }: { l: string; z: string; r?: boolean; children: React.ReactNode }) => (
    <div><label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">{isZh ? z : l} {r && <span className="text-red-500">*</span>}</label>{c}</div>
  );

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/${locale}/admin/blog`} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isZh ? '编辑博客' : 'Edit Blog Post'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <F l="Title (EN)" z="英文标题" r>
            <input value={(form.title_en as string) || ''} onChange={(e) => h('title_en', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
          </F>
          <F l="Title (ZH)" z="中文标题" r>
            <input value={(form.title_zh as string) || ''} onChange={(e) => h('title_zh', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
          </F>
          <F l="Slug" z="Slug"><input value={(form.slug as string) || ''} onChange={(e) => h('slug', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50" /></F>
          <F l="Tags" z="标签"><input value={(form.tags as string) || ''} onChange={(e) => h('tags', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50" /></F>
          <F l="Excerpt (EN)" z="英文摘要"><textarea value={(form.excerpt_en as string) || ''} onChange={(e) => h('excerpt_en', e.target.value)} rows={2} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none" /></F>
          <F l="Excerpt (ZH)" z="中文摘要"><textarea value={(form.excerpt_zh as string) || ''} onChange={(e) => h('excerpt_zh', e.target.value)} rows={2} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none" /></F>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <F l="Content (EN/HTML)" z="英文内容" r>
            <div>
              <button type="button" onClick={() => setPreview(preview === 'en' ? null : 'en')} className="text-xs px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 mb-2"><Eye className="h-3 w-3 inline mr-1" />{preview === 'en' ? (isZh ? '编辑' : 'Edit') : (isZh ? '预览' : 'Preview')}</button>
              {preview === 'en' ? (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 min-h-[200px] prose dark:prose-invert text-sm" dangerouslySetInnerHTML={{ __html: (form.content_en as string) || '' }} />
              ) : (
                <textarea value={(form.content_en as string) || ''} onChange={(e) => h('content_en', e.target.value)} rows={12} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none" />
              )}
            </div>
          </F>
          <F l="Content (ZH/HTML)" z="中文内容">
            <div>
              <button type="button" onClick={() => setPreview(preview === 'zh' ? null : 'zh')} className="text-xs px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 mb-2"><Eye className="h-3 w-3 inline mr-1" />{preview === 'zh' ? (isZh ? '编辑' : 'Edit') : (isZh ? '预览' : 'Preview')}</button>
              {preview === 'zh' ? (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 min-h-[200px] prose dark:prose-invert text-sm" dangerouslySetInnerHTML={{ __html: (form.content_zh as string) || '' }} />
              ) : (
                <textarea value={(form.content_zh as string) || ''} onChange={(e) => h('content_zh', e.target.value)} rows={12} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none" />
              )}
            </div>
          </F>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={!!form.published} onChange={(e) => h('published', e.target.checked)} className="rounded" />
          <span className="text-sm text-zinc-600 dark:text-zinc-400">{isZh ? '已发布' : 'Published'}</span>
        </label>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 px-5 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? (isZh ? '保存中...' : 'Saving...') : (isZh ? '保存' : 'Save')}
        </button>
      </form>
    </div>
  );
}
