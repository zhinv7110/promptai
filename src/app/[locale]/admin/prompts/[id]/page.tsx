'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/ui/ImageUpload';

const CATEGORIES = ['portrait','landscape','fantasy','anime','architecture','abstract','photorealistic','concept-art'];
const MODELS = ['midjourney','stable-diffusion','dalle3','flux','sdxl'];

export default function EditPromptPage() {
  const { locale, id } = useParams<{ locale: string; id: string }>();
  const router = useRouter();
  const isZh = locale === 'zh';

  const [form, setForm] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/prompts/${id}`).then((r) => r.json()).then((data) => {
      if (data) {
        setForm({
          ...data,
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
          gallery_images: Array.isArray(data.gallery_images) ? data.gallery_images : [],
          cover_image: data.cover_image || null,
          negative_prompt: data.negative_prompt || '',
          generation_settings: data.generation_settings ? JSON.stringify(data.generation_settings, null, 2) : '',
          image_alt: data.image_alt || '',
          is_featured: data.is_featured || false,
          is_premium: data.is_premium || false,
        });
      }
      setLoading(false);
    });
  }, [id]);

  const handleChange = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    let genSettings = null;
    const gs = form.generation_settings as string;
    if (gs && gs.trim()) {
      try { genSettings = JSON.parse(gs); } catch { /* ignore */ }
    }
    const res = await fetch(`/api/admin/prompts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tags: typeof form.tags === 'string' ? (form.tags as string).split(',').map((t) => t.trim()).filter(Boolean) : form.tags,
        generation_settings: genSettings,
        negative_prompt: (form.negative_prompt as string) || null,
        image_alt: (form.image_alt as string) || null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) router.push(`/${locale}/admin/prompts`);
    else setError(data.error || 'Save failed');
  };

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-zinc-400" /></div>;

  const F = ({ l, z, r, children: c }: { l: string; z: string; r?: boolean; children: React.ReactNode }) => (
    <div><label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">{isZh ? z : l} {r && <span className="text-red-500">*</span>}</label>{c}</div>
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/${locale}/admin/prompts`} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isZh ? '编辑提示词' : 'Edit Prompt'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <F l="Title (English)" z="英文标题" r>
            <input value={(form.title_en as string) || ''} onChange={(e) => handleChange('title_en', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </F>
          <F l="Title (Chinese)" z="中文标题" r>
            <input value={(form.title_zh as string) || ''} onChange={(e) => handleChange('title_zh', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </F>
          <F l="Slug" z="Slug">
            <input value={(form.slug as string) || ''} onChange={(e) => handleChange('slug', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </F>
          <F l="Model" z="模型">
            <select value={(form.model as string) || 'midjourney'} onChange={(e) => handleChange('model', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </F>
          <F l="Category" z="分类">
            <select value={(form.category as string) || 'portrait'} onChange={(e) => handleChange('category', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </F>
          <F l="Tags" z="标签">
            <input value={(form.tags as string) || ''} onChange={(e) => handleChange('tags', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </F>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <F l="Description (EN)" z="英文描述">
            <textarea value={(form.description_en as string) || ''} onChange={(e) => handleChange('description_en', e.target.value)} rows={2} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
          </F>
          <F l="Description (ZH)" z="中文描述">
            <textarea value={(form.description_zh as string) || ''} onChange={(e) => handleChange('description_zh', e.target.value)} rows={2} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
          </F>
        </div>

        {/* Image upload */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
          <ImageUpload
            coverImage={(form.cover_image as string) || null}
            galleryImages={(form.gallery_images as string[]) || []}
            onCoverChange={(url) => handleChange('cover_image', url)}
            onGalleryChange={(urls) => setForm((p) => ({ ...p, gallery_images: urls }))}
            isZh={isZh}
          />
        </div>

        <F l="Image Alt Text" z="图片 Alt 文本">
          <input value={(form.image_alt as string) || ''} onChange={(e) => handleChange('image_alt', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
        </F>

        <F l="Prompt Text" z="提示词文本" r>
          <textarea value={(form.prompt_text as string) || ''} onChange={(e) => handleChange('prompt_text', e.target.value)} rows={6} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
        </F>

        <F l="Negative Prompt" z="负面提示词">
          <textarea value={(form.negative_prompt as string) || ''} onChange={(e) => handleChange('negative_prompt', e.target.value)} rows={2} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
        </F>

        <F l="Generation Settings (JSON)" z="生成参数 (JSON)">
          <textarea value={(form.generation_settings as string) || ''} onChange={(e) => handleChange('generation_settings', e.target.value)} rows={2} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
        </F>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!form.is_premium} onChange={(e) => handleChange('is_premium', e.target.checked)} className="rounded" />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{isZh ? 'Premium 标记' : 'Mark as Premium'}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!form.is_featured} onChange={(e) => handleChange('is_featured', e.target.checked)} className="rounded" />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{isZh ? '精选标记' : 'Mark as Featured'}</span>
          </label>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 px-5 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? (isZh ? '保存中...' : 'Saving...') : (isZh ? '保存' : 'Save')}
        </button>
      </form>
    </div>
  );
}
