'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Upload, Loader2, Check, X, FileJson, FileText } from 'lucide-react';

export default function AdminImportPage() {
  const { locale } = useParams<{ locale: string }>();
  const isZh = locale === 'zh';

  const [type, setType] = useState<'prompts' | 'blog'>('prompts');
  const [jsonText, setJsonText] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ ok: number; fail: number; errors: string[] } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setJsonText(ev.target?.result as string || '');
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!jsonText.trim()) return;
    setImporting(true);
    setResult(null);

    try {
      const items = JSON.parse(jsonText);
      const arr = Array.isArray(items) ? items : [items];
      let ok = 0, fail = 0;
      const errors: string[] = [];

      for (let i = 0; i < arr.length; i++) {
        try {
          const endpoint = type === 'prompts' ? '/api/admin/prompts' : '/api/admin/blog';
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(arr[i]),
          });
          const data = await res.json();
          if (data.ok) ok++;
          else { fail++; errors.push(`Row ${i + 1}: ${data.error}`); }
        } catch {
          fail++; errors.push(`Row ${i + 1}: Network error`);
        }
      }
      setResult({ ok, fail, errors });
    } catch {
      setResult({ ok: 0, fail: 1, errors: ['Invalid JSON format'] });
    }
    setImporting(false);
  };

  const samplePrompt = JSON.stringify([{ title_en: 'My Prompt', title_zh: '我的提示词', slug: 'my-prompt', category: 'portrait', prompt_text: 'A detailed prompt...', tags: ['portrait'], model: 'midjourney' }], null, 2);
  const sampleBlog = JSON.stringify([{ title_en: 'My Post', title_zh: '我的文章', slug: 'my-post', content_en: '<p>Hello</p>', content_zh: '<p>你好</p>', excerpt_en: 'A post', excerpt_zh: '一篇文章', tags: ['tutorial'], published: true }], null, 2);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">{isZh ? '批量导入' : 'Bulk Import'}</h1>

      {/* Type selector */}
      <div className="flex gap-2 mb-4">
        {(['prompts', 'blog'] as const).map((t) => (
          <button key={t} onClick={() => { setType(t); setResult(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === t ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
            {t === 'prompts' ? (isZh ? '提示词' : 'Prompts') : (isZh ? '博客' : 'Blog')}
          </button>
        ))}
      </div>

      {/* Template */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isZh ? '导入格式示例' : 'Format Example'}</h3>
          <button onClick={() => setJsonText(type === 'prompts' ? samplePrompt : sampleBlog)} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
            {isZh ? '填入示例' : 'Fill example'}
          </button>
        </div>
        <pre className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 overflow-x-auto max-h-48">
          {type === 'prompts' ? samplePrompt : sampleBlog}
        </pre>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <label className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 px-4 py-8 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors text-sm text-zinc-500">
            <Upload className="h-5 w-5" />
            {isZh ? '上传 JSON/CSV 文件' : 'Upload JSON/CSV file'}
            <input type="file" accept=".json,.csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={10}
          placeholder={isZh ? '或直接粘贴 JSON 数据...' : 'Or paste JSON data directly...'}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
        />
        <button onClick={handleImport} disabled={!jsonText.trim() || importing}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 px-5 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
          {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {importing ? (isZh ? '导入中...' : 'Importing...') : (isZh ? '开始导入' : 'Start Import')}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={`mt-4 rounded-2xl border p-4 ${result.fail === 0 ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20' : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20'}`}>
          <div className="flex items-center gap-2 mb-2">
            {result.fail === 0 ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-amber-500" />}
            <span className="font-semibold text-sm">
              {isZh ? `成功 ${result.ok} 条，失败 ${result.fail} 条` : `${result.ok} OK, ${result.fail} failed`}
            </span>
          </div>
          {result.errors.length > 0 && (
            <div className="text-xs text-red-600 dark:text-red-400 space-y-0.5 max-h-32 overflow-y-auto">
              {result.errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
