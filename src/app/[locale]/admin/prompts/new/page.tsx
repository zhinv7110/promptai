'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/ui/ImageUpload';

const CATEGORIES = ['portrait','landscape','fantasy','anime','architecture','abstract','photorealistic','concept-art'];
const MODELS = ['midjourney','stable-diffusion','dalle3','flux','sdxl'];

export default function NewPromptPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const isZh = locale === 'zh';

  const [form, setForm] = useState({
    title_en: '', title_zh: '', slug: '',
    description_en: '', description_zh: '',
    category: 'portrait', tags: '',
    prompt_text: '', model: 'midjourney',
    negative_prompt: '', generation_settings: '',
    cover_image: null as string | null,
    gallery_images: [] as string[],
    image_alt: '', is_premium: false, is_featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string | boolean | null) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title_en' && !prev.slug && typeof value === 'string') {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title_en || !form.title_zh || !form.prompt_text) {
      setError(isZh ? '请填写必填字段' : 'Required fields missing');
      return;
    }
    setSaving(true);
    setError('');
    let genSettings = null;
    if (form.generation_settings.trim()) {
      try { genSettings = JSON.parse(form.generation_settings); } catch { /* ignore */ }
    }
    const res = await fetch('/api/admin/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        slug: form.slug || form.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        generation_settings: genSettings,
        negative_prompt: form.negative_prompt || null,
        image_alt: form.image_alt || null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) router.push(`/${locale}/admin/prompts`);
    else setError(data.error || 'Save failed');
  };

  const Field = ({ label, zh, required, children }: { label: string; zh: string; required?: boolean; children?: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
        {isZh ? zh : label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/${locale}/admin/prompts`} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isZh ? '新建提示词' : 'New Prompt'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title (English)" zh="英文标题" required>
            <input value={form.title_en} onChange={(e) => handleChange('title_en', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="Cinematic Portrait at Golden Hour" />
          </Field>
          <Field label="Title (Chinese)" zh="中文标题" required>
            <input value={form.title_zh} onChange={(e) => handleChange('title_zh', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="黄金时刻电影质感人像" />
          </Field>
          <Field label="Slug" zh="Slug">
            <input value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="auto-generated" />
          </Field>
          <Field label="Model" zh="模型">
            <select value={form.model} onChange={(e) => handleChange('model', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Category" zh="分类">
            <select value={form.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Tags" zh="标签">
            <input value={form.tags} onChange={(e) => handleChange('tags', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="portrait, cinematic, photorealistic" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Description (English)" zh="英文描述">
            <textarea value={form.description_en} onChange={(e) => handleChange('description_en', e.target.value)} rows={2} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
          </Field>
          <Field label="Description (Chinese)" zh="中文描述">
            <textarea value={form.description_zh} onChange={(e) => handleChange('description_zh', e.target.value)} rows={2} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
          </Field>
        </div>

        {/* Image upload */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
          <ImageUpload
            coverImage={form.cover_image}
            galleryImages={form.gallery_images}
            onCoverChange={(url) => handleChange('cover_image', url)}
            onGalleryChange={(urls) => setForm((p) => ({ ...p, gallery_images: urls }))}
            isZh={isZh}
          />
        </div>

        <Field label="Image Alt Text" zh="图片 Alt 文本">
          <input value={form.image_alt} onChange={(e) => handleChange('image_alt', e.target.value)} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="A cinematic portrait at golden hour..." />
        </Field>

        <Field label="Prompt Text" zh="提示词文本" required>
          <textarea value={form.prompt_text} onChange={(e) => handleChange('prompt_text', e.target.value)} rows={6} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" placeholder="cinematic portrait photography, golden hour lighting..." />
        </Field>

        <Field label="Negative Prompt" zh="负面提示词">
          <textarea value={form.negative_prompt} onChange={(e) => handleChange('negative_prompt', e.target.value)} rows={2} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" placeholder="ugly, deformed, blurry, low resolution..." />
        </Field>

        <Field label="Generation Settings (JSON)" zh="生成参数 (JSON)">
          <textarea value={form.generation_settings} onChange={(e) => handleChange('generation_settings', e.target.value)} rows={2} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" placeholder='{"steps": 30, "cfg_scale": 7, "sampler": "DPM++ 2M Karras"}' />
        </Field>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_premium} onChange={(e) => handleChange('is_premium', e.target.checked)} className="rounded" />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{isZh ? 'Premium 标记' : 'Mark as Premium'}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => handleChange('is_featured', e.target.checked)} className="rounded" />
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
