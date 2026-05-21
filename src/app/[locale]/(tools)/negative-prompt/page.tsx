'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { OutputLanguageSelector, useOutputLang } from '@/components/ui/OutputLanguageSelector';
import { generateZhExplanation } from '@/lib/language';
import {
  Copy, Check, ShieldX, History, Trash2,
  SlidersHorizontal, Loader2, RefreshCw,
  Sparkles, Plus, X, Gauge,
} from 'lucide-react';

// Negative prompt category presets
const CATEGORY_PRESETS: Record<string, { en: string; zh: string; base: string[]; extras: string[] }> = {
  portrait: {
    en: 'Portrait',
    zh: '人像',
    base: ['ugly', 'deformed', 'blurry', 'low quality', 'bad anatomy', 'extra limbs', 'mutated hands', 'disfigured', 'poorly drawn face', 'distorted features', 'asymmetric eyes', 'crooked teeth', 'fused fingers', 'too many fingers', 'long neck'],
    extras: ['watermark', 'text', 'signature', 'username', 'artist name', 'grainy', 'jpeg artifacts'],
  },
  landscape: {
    en: 'Landscape',
    zh: '风景',
    base: ['blurry', 'low quality', 'haze', 'overexposed', 'underexposed', 'flat', 'boring', 'poor composition', 'distorted perspective', 'unnatural colors', 'oversaturated'],
    extras: ['watermark', 'text', 'signature', 'frame', 'border', 'people', 'vehicles', 'grainy'],
  },
  anime: {
    en: 'Anime',
    zh: '动漫',
    base: ['3D render', 'realistic', 'photorealistic', 'photo', 'western cartoon style', 'bad anatomy', 'ugly', 'deformed', 'blurry', 'low quality', 'bad hands', 'missing fingers', 'extra digits'],
    extras: ['watermark', 'text', 'signature', 'artist name', 'meme', 'screenshot', 'grainy'],
  },
  architecture: {
    en: 'Architecture',
    zh: '建筑',
    base: ['people', 'blurry', 'distorted', 'poor lighting', 'cluttered', 'messy', 'unfinished', 'construction', 'scaffolding', 'asymmetric', 'warped', 'low quality'],
    extras: ['watermark', 'text', 'logo', 'sign', 'advertisement', 'branding'],
  },
  product: {
    en: 'Product',
    zh: '产品',
    base: ['blurry', 'dirty', 'dusty', 'scratched', 'damaged', 'broken', 'low quality', 'bad lighting', 'reflection', 'glare', 'background clutter', 'distorted'],
    extras: ['watermark', 'text', 'logo', 'brand', 'price tag', 'barcode', 'label'],
  },
  food: {
    en: 'Food',
    zh: '美食',
    base: ['blurry', 'unappetizing', 'messy', 'burnt', 'rotten', 'moldy', 'dirty plate', 'bad lighting', 'oversaturated', 'plastic looking', 'fake food', 'low quality'],
    extras: ['watermark', 'text', 'menu', 'price', 'restaurant name'],
  },
  fantasy: {
    en: 'Fantasy',
    zh: '奇幻',
    base: ['modern', 'contemporary', 'technology', 'cars', 'phones', 'blurry', 'low quality', 'bad anatomy', 'deformed', 'ugly', 'poor composition'],
    extras: ['watermark', 'text', 'signature', 'meme text', 'comic sans'],
  },
  fashion: {
    en: 'Fashion',
    zh: '时尚',
    base: ['blurry', 'bad anatomy', 'deformed', 'ugly', 'poor posture', 'wrinkled clothes', 'dirty fabric', 'bad lighting', 'cluttered background', 'distorted proportions'],
    extras: ['watermark', 'text', 'logo', 'brand', 'price tag'],
  },
  'sci-fi': {
    en: 'Sci-Fi',
    zh: '科幻',
    base: ['fantasy', 'magic', 'medieval', 'low tech', 'blurry', 'low quality', 'bad anatomy', 'deformed', 'poor design', 'boring', 'generic'],
    extras: ['watermark', 'text', 'signature', 'meme', 'cartoon'],
  },
};

const QUALITY_NEGATIVES = {
  standard: { en: 'Standard', zh: '标准', items: ['low quality', 'blurry', 'watermark', 'text', 'signature'] },
  high: { en: 'High Quality', zh: '高质量', items: ['low quality', 'blurry', 'distorted', 'watermark', 'text', 'signature', 'jpeg artifacts', 'grainy', 'pixelated', 'bad composition'] },
  extreme: { en: 'Extreme', zh: '极致', items: ['ugly', 'deformed', 'disfigured', 'blurry', 'grainy', 'low resolution', 'jpeg artifacts', 'watermark', 'text', 'signature', 'logo', 'bad anatomy', 'extra limbs', 'missing limbs', 'floating limbs', 'disconnected limbs', 'malformed hands', 'poorly drawn face', 'mutated', 'mutilated', 'distorted', 'out of frame', 'out of focus', 'bad composition', 'overexposed', 'underexposed', 'bad lighting'] },
};

interface HistoryItem {
  id: string;
  negatives: string[];
  quality: string;
  timestamp: number;
}

export default function NegativePromptPage() {
  const { locale } = useParams<{ locale: string }>();
  const isZh = locale === 'zh';

  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [quality, setQuality] = useState('high');
  const [output, setOutput] = useState('');
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [outputLang, setOutputLang] = useOutputLang(locale);

  useEffect(() => {
    const saved = localStorage.getItem('np-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const toggleCat = (catId: string) => {
    const next = new Set(selectedCats);
    if (next.has(catId)) next.delete(catId);
    else next.add(catId);
    setSelectedCats(next);
  };

  const addCustomItem = () => {
    const val = customInput.trim().toLowerCase();
    if (val && !customItems.includes(val)) {
      setCustomItems([...customItems, val]);
      setCustomInput('');
    }
  };

  const removeCustomItem = (item: string) => {
    setCustomItems(customItems.filter((c) => c !== item));
  };

  const handleGenerate = useCallback(() => {
    setGenerating(true);
    setTimeout(() => {
      const negatives = new Set<string>();

      // Add quality negatives
      QUALITY_NEGATIVES[quality as keyof typeof QUALITY_NEGATIVES].items.forEach((n) => negatives.add(n));

      // Add category negatives
      selectedCats.forEach((catId) => {
        const preset = CATEGORY_PRESETS[catId];
        if (preset) {
          preset.base.forEach((n) => negatives.add(n));
          preset.extras.forEach((n) => negatives.add(n));
        }
      });

      // Add custom items
      customItems.forEach((n) => negatives.add(n));

      const result = Array.from(negatives).join(', ');
      setOutput(result);
      setGenerating(false);

      const item: HistoryItem = {
        id: Date.now().toString(),
        negatives: Array.from(negatives),
        quality,
        timestamp: Date.now(),
      };
      const updated = [item, ...history].slice(0, 20);
      setHistory(updated);
      localStorage.setItem('np-history', JSON.stringify(updated));
    }, 400);
  }, [selectedCats, quality, customItems, history]);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('np-history');
  };

  const loadFromHistory = (item: HistoryItem) => {
    setOutput(item.negatives.join(', '));
    setShowHistory(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="inline-flex rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3.5 text-white shadow-lg shadow-emerald-500/25">
          <ShieldX className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {isZh ? '负面提示词生成器' : 'Negative Prompt Generator'}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {isZh ? '为你的图像生成选择要排除的内容，获得更干净的结果' : 'Pick what to exclude from your image generation for cleaner results'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Selection Panel */}
        <div className="space-y-4">
          {/* Quality Level */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              {isZh ? '排除质量等级' : 'Quality Level'}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(QUALITY_NEGATIVES).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setQuality(key)}
                  className={`rounded-xl px-4 py-3 text-center transition-all ${
                    quality === key
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-300 dark:ring-emerald-700'
                      : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="text-sm font-semibold">{isZh ? val.zh : val.en}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{val.items.length} items</div>
                </button>
              ))}
            </div>
          </div>

          {/* Category selection */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              {isZh ? '按类别排除' : 'Exclude by Category'}
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(CATEGORY_PRESETS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => toggleCat(key)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                    selectedCats.has(key)
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-300 dark:ring-emerald-700'
                      : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>{isZh ? val.zh : val.en}</span>
                  <span className="text-xs text-zinc-400">
                    {val.base.length + val.extras.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom items */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              {isZh ? '自定义排除词' : 'Custom Exclusions'}
            </h3>
            <div className="flex gap-2">
              <input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}
                placeholder={isZh ? '输入要排除的词...' : 'Add a term to exclude...'}
                className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              <button
                onClick={addCustomItem}
                disabled={!customInput.trim()}
                className="inline-flex items-center gap-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 disabled:opacity-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {customItems.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {customItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    {item}
                    <button onClick={() => removeCustomItem(item)} className="hover:text-red-500 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Generate */}
          <button
            onClick={handleGenerate}
            disabled={selectedCats.size === 0 || generating}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:from-emerald-400 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldX className="h-4 w-4" />
            )}
            {generating ? (isZh ? '生成中...' : 'Generating...') : (isZh ? '生成负面提示词' : 'Generate Negative Prompt')}
          </button>
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          {output ? (
            <>
              <div className="mb-2 flex justify-end">
                <OutputLanguageSelector value={outputLang} onChange={setOutputLang} locale={locale} />
              </div>
              {/* Stats */}
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  {isZh ? `${output.split(', ').length} 个排除词` : `${output.split(', ').length} exclusion terms`}
                </div>
                <div className="flex-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-500">
                  {isZh
                    ? `${selectedCats.size} 个类别 · ${quality} 质量`
                    : `${selectedCats.size} categories · ${quality} quality`}
                </div>
              </div>

              {/* Output box */}
              <div className="rounded-2xl border border-rose-200/80 dark:border-rose-800/60 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-900/50 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-400">
                    <ShieldX className="h-3 w-3" /> negative prompt
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerate}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => copyText(output, 'main')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/30 px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-950/50 transition-colors"
                    >
                      {copied === 'main' ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied === 'main' ? (isZh ? '已复制' : 'Copied!') : (isZh ? '复制' : 'Copy')}
                    </button>
                  </div>
                </div>
                <p className="text-sm font-mono leading-relaxed text-rose-700/80 dark:text-rose-300/80 whitespace-pre-wrap break-all">
                  {output}
                </p>
              </div>

              {/* Usage tip */}
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  {isZh ? '使用方式' : 'How to use'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {isZh
                    ? '将上面的负面提示词粘贴到 Midjourney（--no 参数）或 Stable Diffusion（Negative Prompt 字段）中。它会告诉 AI 你想要避免的所有东西，帮助你得到更干净、更符合预期的结果。'
                    : 'Paste the negative prompt above into Midjourney (--no param) or Stable Diffusion (Negative Prompt field). It tells the AI what to avoid, giving you cleaner, more predictable results.'}
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-12 text-center">
              <ShieldX className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-600" />
              <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">
                {isZh ? '选择类别和质量等级，然后点击生成' : 'Select categories and quality level, then generate'}
              </p>
            </div>
          )}

          {/* History */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              <History className="h-4 w-4" />
              {isZh ? '历史记录' : 'History'} ({history.length})
            </button>
            {history.length > 0 && (
              <button onClick={clearHistory} className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs text-zinc-400 hover:text-red-500 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {showHistory && (
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-4 shadow-sm space-y-2 max-h-64 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-sm text-zinc-400 text-center py-4">{isZh ? '暂无历史记录' : 'No history yet'}</p>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 line-clamp-2">
                      {item.negatives.slice(0, 8).join(', ')}{item.negatives.length > 8 ? '...' : ''}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-zinc-400">{item.negatives.length} terms</span>
                      <span className="text-xs text-zinc-300">·</span>
                      <span className="text-xs text-zinc-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
