'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Copy, Check, Sparkles, History, Trash2,
  ChevronDown, Zap, Gauge, Lightbulb, Camera, Palette,
} from 'lucide-react';
import {
  generatePrompt,
  generateNegativePrompt,
  generateVariations,
  estimatePromptQuality,
  type PromptOptions,
} from '@/lib/prompt-engine';

const STYLES = [
  { id: '', label: 'None', zh: '无' },
  { id: 'cinematic', label: 'Cinematic', zh: '电影感' },
  { id: 'photorealistic', label: 'Photorealistic', zh: '写实' },
  { id: 'anime', label: 'Anime', zh: '动漫' },
  { id: 'digital', label: 'Digital Art', zh: '数字艺术' },
  { id: 'oil-painting', label: 'Oil Painting', zh: '油画' },
  { id: 'watercolor', label: 'Watercolor', zh: '水彩' },
  { id: '3d-render', label: '3D Render', zh: '3D渲染' },
  { id: 'minimal', label: 'Minimalist', zh: '极简' },
  { id: 'surreal', label: 'Surreal', zh: '超现实' },
  { id: 'retro', label: 'Retro/80s', zh: '复古/80年代' },
];

const LIGHTING = [
  { id: '', label: 'None', zh: '无' },
  { id: 'golden-hour', label: 'Golden Hour', zh: '黄金时刻' },
  { id: 'studio', label: 'Studio', zh: '影棚' },
  { id: 'cinematic', label: 'Cinematic', zh: '电影感' },
  { id: 'neon', label: 'Neon', zh: '霓虹' },
  { id: 'natural', label: 'Natural Day', zh: '自然日间' },
  { id: 'night', label: 'Night/Moon', zh: '夜间/月光' },
];

const CAMERAS = [
  { id: '', label: 'None', zh: '无' },
  { id: 'wide', label: 'Wide Angle', zh: '广角' },
  { id: 'closeup', label: 'Close-up Macro', zh: '微距特写' },
  { id: 'portrait', label: 'Portrait Lens', zh: '人像镜头' },
  { id: 'aerial', label: 'Aerial/Drone', zh: '航拍俯视' },
  { id: 'telephoto', label: 'Telephoto', zh: '长焦' },
];

const QUALITIES = [
  { id: 'standard', label: 'Standard', zh: '标准' },
  { id: 'high', label: 'High Quality', zh: '高品质' },
  { id: 'extreme', label: 'Extreme Detail', zh: '极致细节' },
  { id: 'mobile', label: 'Mobile Optimized', zh: '手机优化' },
];

const MODELS = [
  { id: 'midjourney', label: 'Midjourney' },
  { id: 'sdxl', label: 'SDXL' },
  { id: 'dalle3', label: 'DALL-E 3' },
  { id: 'flux', label: 'Flux' },
];

interface HistoryItem {
  id: string;
  prompt: string;
  negative: string;
  subject: string;
  options: PromptOptions;
  quality: number;
  timestamp: number;
}

export default function PromptGeneratorPage() {
  const { locale } = useParams<{ locale: string }>();
  const isZh = locale === 'zh';

  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState('');
  const [lighting, setLighting] = useState('');
  const [camera, setCamera] = useState('');
  const [quality, setQuality] = useState('high');
  const [detail, setDetail] = useState('');
  const [model, setModel] = useState('midjourney');

  const [output, setOutput] = useState('');
  const [negative, setNegative] = useState('');
  const [variations, setVariations] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [copied, setCopied] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pg-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleGenerate = useCallback(() => {
    if (!subject.trim()) return;

    const opts: PromptOptions = {
      subject: subject.trim(),
      style: style || undefined,
      quality: quality || undefined,
      lighting: lighting || undefined,
      camera: camera || undefined,
      detail: detail || undefined,
      model: model as PromptOptions['model'],
    };

    const prompt = generatePrompt(opts);
    const neg = generateNegativePrompt(style || undefined);
    const vars = generateVariations(prompt, 3);
    const q = estimatePromptQuality(prompt);

    setOutput(prompt);
    setNegative(neg);
    setVariations(vars);
    setScore(q);

    // Save history
    const item: HistoryItem = {
      id: Date.now().toString(),
      prompt,
      negative: neg,
      subject,
      options: opts,
      quality: q,
      timestamp: Date.now(),
    };
    const updated = [item, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem('pg-history', JSON.stringify(updated));
  }, [subject, style, lighting, camera, quality, detail, model, history]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setSubject(item.subject);
    setOutput(item.prompt);
    setNegative(item.negative);
    setScore(item.quality);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('pg-history');
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="inline-flex rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3.5 text-white shadow-lg shadow-indigo-500/25">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {isZh ? 'AI 提示词生成器' : 'AI Prompt Generator'}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {isZh ? '输入描述，生成优化后的英文图像提示词' : 'Enter a description, get an optimized English image prompt'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              {isZh ? '描述你想创作的内容' : 'Describe what to create'}
            </label>
            <textarea
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={isZh ? '例如：一位穿着红色连衣裙的女士站在海边，夕阳...' : 'e.g. A woman in a red dress standing by the ocean at sunset...'}
              rows={4}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
            />

            <button
              onClick={handleGenerate}
              disabled={!subject.trim()}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="h-4 w-4" />
              {isZh ? '生成提示词' : 'Generate Prompt'}
            </button>
          </div>

          {/* Quick Options */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 shadow-sm space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                <Palette className="h-3.5 w-3.5" /> {isZh ? '风格' : 'Style'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STYLES.slice(0, 6).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(style === s.id ? '' : s.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      style === s.id
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-300 dark:ring-indigo-700'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {isZh && s.zh !== '无' ? s.zh : s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                <Lightbulb className="h-3.5 w-3.5" /> {isZh ? '光线' : 'Lighting'}
              </label>
              <select
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {LIGHTING.map((l) => (
                  <option key={l.id} value={l.id}>{isZh && l.zh !== '无' ? l.zh : l.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                <Camera className="h-3.5 w-3.5" /> {isZh ? '镜头' : 'Camera'}
              </label>
              <select
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {CAMERAS.map((c) => (
                  <option key={c.id} value={c.id}>{isZh && c.zh !== '无' ? c.zh : c.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              {isZh ? '更多选项' : 'More options'}
              <ChevronDown className={`h-3 w-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {showAdvanced && (
              <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                    {isZh ? '画质' : 'Quality'}
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    {QUALITIES.map((q) => (
                      <option key={q.id} value={q.id}>{isZh ? q.zh : q.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                    {isZh ? 'AI 模型' : 'AI Model'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setModel(m.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          model === m.id
                            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-300'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                    {isZh ? '额外细节' : 'Extra details'}
                  </label>
                  <input
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    placeholder={isZh ? '额外关键词，如 intricate, elegant...' : 'Extra keywords, e.g. intricate, elegant...'}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 space-y-4">
          {output ? (
            <>
              {/* Main output */}
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                      <Gauge className="h-3 w-3" /> {score}/100
                    </span>
                    <span className="text-xs text-zinc-400">
                      {model.toUpperCase()}{' | '}{style || 'custom'}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(output, 'main')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                  >
                    {copied === 'main' ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied === 'main' ? (isZh ? '已复制' : 'Copied!') : (isZh ? '复制' : 'Copy')}
                  </button>
                </div>
                <p className="text-sm font-mono leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                  {output}
                </p>
              </div>

              {/* Variations */}
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                  {isZh ? '变体版本' : 'Variations'}
                </h3>
                <div className="space-y-2">
                  {variations.map((v, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-3 group hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 font-mono leading-relaxed flex-1">
                        {v}
                      </p>
                      <button
                        onClick={() => copyToClipboard(v, `var-${i}`)}
                        className="shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        {copied === `var-${i}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Negative prompt */}
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                    {isZh ? '负面提示词' : 'Negative Prompt'}
                  </h3>
                  <button
                    onClick={() => copyToClipboard(negative, 'neg')}
                    className="inline-flex items-center gap-1 rounded-lg bg-rose-50 dark:bg-rose-950/30 px-3 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors"
                  >
                    {copied === 'neg' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied === 'neg' ? (isZh ? '已复制' : 'Copied!') : (isZh ? '复制' : 'Copy')}
                  </button>
                </div>
                <p className="text-sm font-mono text-rose-700/80 dark:text-rose-300/80">{negative}</p>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-12 text-center">
              <Sparkles className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-600" />
              <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">
                {isZh ? '在左侧输入描述后点击生成' : 'Enter a description on the left and click generate'}
              </p>
            </div>
          )}

          {/* History button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              <History className="h-4 w-4" />
              {isZh ? '历史记录' : 'History'} ({history.length})
            </button>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* History panel */}
          {showHistory && (
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-4 shadow-sm space-y-2 max-h-64 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-sm text-zinc-400 text-center py-4">
                  {isZh ? '暂无历史记录' : 'No history yet'}
                </p>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 line-clamp-2">
                      {item.prompt}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-zinc-400">{item.subject.slice(0, 40)}</span>
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
