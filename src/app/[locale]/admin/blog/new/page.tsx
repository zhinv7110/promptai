'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function NewBlogPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const isZh = locale === 'zh';

  const [form, setForm] = useState({
    title_en: '', title_zh: '', slug: '',
    excerpt_en: '', excerpt_zh: '',
    content_en: '', content_zh: '',
    tags: '', published: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<'en' | 'zh' | null>(null);

  const handleChange = (f: string, v: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [f]: v };
      if (f === 'title_en' && !prev.slug) next.slug = (v as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title_en || !form.title_zh || !form.content_en) {
      setError(isZh ? '请填写必填字段' : 'Required fields missing');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        slug: form.slug || form.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) router.push(`/${locale}/admin/blog`);
    else setError(data.error || 'Save failed');
  };

  const F = ({ l, z, r, children: c }: { l: string; z: string; r?: boolean; children: React.ReactNode }) => (
    <div><label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">{isZh ? z : l} {r && <span className="text-red-500">*</span>}</label>{c}</div>
  );

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/${locale}/admin/blog`} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isZh ? '新建博客' : 'New Blog Post'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <F l="Title (English)" z="英文标题" r>
            <input value={form.title_en} onChange={(e) => handleChange('title_en', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50" placeholder="Getting Started with AI Prompts" />
          </F>
          <F l="Title (Chinese)" z="中文标题" r>
            <input value={form.title_zh} onChange={(e) => handleChange('title_zh', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50" placeholder="AI提示词入门指南" />
          </F>
          <F l="Slug" z="Slug">
            <input value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
          </F>
          <F l="Tags" z="标签">
            <input value={form.tags} onChange={(e) => handleChange('tags', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50" placeholder="beginner, tutorial, midjourney" />
          </F>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <F l="Excerpt (English)" z="英文摘要">
            <textarea value={form.excerpt_en} onChange={(e) => handleChange('excerpt_en', e.target.value)} rows={2} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none" />
          </F>
          <F l="Excerpt (Chinese)" z="中文摘要">
            <textarea value={form.excerpt_zh} onChange={(e) => handleChange('excerpt_zh', e.target.value)} rows={2} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none" />
          </F>
        </div>

        {/* Content editors */}
        <div className="grid gap-5 lg:grid-cols-2">
          <F l="Content (English / HTML)" z="英文内容" r>
            <div>
              <div className="flex gap-1 mb-2">
                <button type="button" onClick={() => setPreview(preview === 'en' ? null : 'en')} className="text-xs px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors">
                  <Eye className="h-3 w-3 inline mr-1" />{preview === 'en' ? (isZh ? '编辑' : 'Edit') : (isZh ? '预览' : 'Preview')}
                </button>
              </div>
              {preview === 'en' ? (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 min-h-[200px] prose dark:prose-invert text-sm" dangerouslySetInnerHTML={{ __html: form.content_en }} />
              ) : (
                <textarea value={form.content_en} onChange={(e) => handleChange('content_en', e.target.value)} rows={12} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none" placeholder="<h2>Section title</h2><p>Paragraph text...</p>" />
              )}
            </div>
          </F>
          <F l="Content (Chinese / HTML)" z="中文内容">
            <div>
              <div className="flex gap-1 mb-2">
                <button type="button" onClick={() => setPreview(preview === 'zh' ? null : 'zh')} className="text-xs px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors">
                  <Eye className="h-3 w-3 inline mr-1" />{preview === 'zh' ? (isZh ? '编辑' : 'Edit') : (isZh ? '预览' : 'Preview')}
                </button>
              </div>
              {preview === 'zh' ? (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 min-h-[200px] prose dark:prose-invert text-sm" dangerouslySetInnerHTML={{ __html: form.content_zh }} />
              ) : (
                <textarea value={form.content_zh} onChange={(e) => handleChange('content_zh', e.target.value)} rows={12} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none" placeholder="<h2>标题</h2><p>段落文字...</p>" />
              )}
            </div>
          </F>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => handleChange('published', e.target.checked)} className="rounded" />
          <span className="text-sm text-zinc-600 dark:text-zinc-400">{isZh ? '直接发布' : 'Publish immediately'}</span>
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
