'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { OutputLanguageSelector, useOutputLang } from '@/components/ui/OutputLanguageSelector';
import { generateZhExplanation } from '@/lib/language';
import {
  Copy, Check, Palette, History, Trash2,
  Sparkles, Loader2, RefreshCw, Gauge,
  Camera, Lightbulb, ChevronDown,
} from 'lucide-react';

interface StylePreset {
  id: string;
  en: string;
  zh: string;
  prompt: string;
  icon: string;
}

const STYLE_CATEGORIES: { id: string; en: string; zh: string; styles: StylePreset[] }[] = [
  {
    id: 'artistic',
    en: 'Artistic',
    zh: '艺术风格',
    styles: [
      { id: 'oil-painting', en: 'Oil Painting', zh: '油画', prompt: 'oil painting, impasto texture, classical art, rich pigments, visible brushstrokes, fine art', icon: '🎨' },
      { id: 'watercolor', en: 'Watercolor', zh: '水彩', prompt: 'watercolor painting, soft brushstrokes, flowing colors, artistic, paper texture, delicate wash', icon: '🖌️' },
      { id: 'sketch', en: 'Pencil Sketch', zh: '铅笔素描', prompt: 'pencil sketch, hand-drawn, detailed linework, graphite, artistic shading, monochrome', icon: '✏️' },
      { id: 'ink', en: 'Ink Wash', zh: '水墨', prompt: 'ink wash painting, sumi-e style, brush strokes, traditional Chinese art, minimalist, zen aesthetic', icon: '🖋️' },
      { id: 'gouache', en: 'Gouache', zh: '水粉', prompt: 'gouache painting, opaque watercolor, matte finish, bold colors, illustration art, flat brush texture', icon: '🎨' },
      { id: 'acrylic', en: 'Acrylic', zh: '丙烯', prompt: 'acrylic painting, bold brushwork, vibrant colors, modern art, thick paint layers, expressive', icon: '🖼️' },
    ],
  },
  {
    id: 'digital',
    en: 'Digital Art',
    zh: '数字艺术',
    styles: [
      { id: 'digital-painting', en: 'Digital Painting', zh: '数字绘画', prompt: 'digital painting, concept art, artstation, trending on cgsociety, professional illustration', icon: '💻' },
      { id: '3d-render', en: '3D Render', zh: '3D渲染', prompt: '3D render, Octane render, Unreal Engine 5, ray tracing, CGI, hyperrealistic, 8K', icon: '🎮' },
      { id: 'low-poly', en: 'Low Poly', zh: '低多边形', prompt: 'low poly 3D, geometric shapes, minimalist 3D render, isometric view, flat shading, game art', icon: '💎' },
      { id: 'pixel-art', en: 'Pixel Art', zh: '像素风', prompt: 'pixel art, 16-bit style, retro game graphics, dithering, limited palette, sprite art', icon: '👾' },
      { id: 'voxel', en: 'Voxel Art', zh: '体素风', prompt: 'voxel art, blocky 3D, Minecraft aesthetic, cubic style, isometric, cute block characters', icon: '🧊' },
      { id: 'vector', en: 'Vector Art', zh: '矢量插画', prompt: 'vector art, flat design, clean lines, vibrant colors, illustration, scalable, modern graphic', icon: '📐' },
    ],
  },
  {
    id: 'photography',
    en: 'Photography',
    zh: '摄影风格',
    styles: [
      { id: 'cinematic', en: 'Cinematic', zh: '电影感', prompt: 'cinematic photography, film grain, anamorphic lens, 35mm, dramatic lighting, color graded', icon: '🎬' },
      { id: 'portrait-photo', en: 'Portrait', zh: '人像摄影', prompt: 'portrait photography, 85mm lens, beautiful bokeh, sharp eyes, natural skin texture, professional lighting', icon: '📷' },
      { id: 'macro', en: 'Macro', zh: '微距', prompt: 'macro photography, extreme close-up, shallow depth of field, intricate details, 100mm macro lens', icon: '🔍' },
      { id: 'aerial', en: 'Aerial', zh: '航拍', prompt: 'aerial photography, drone shot, birds-eye view, top-down perspective, landscape, 24mm wide angle', icon: '🚁' },
      { id: 'vintage-photo', en: 'Vintage', zh: '复古照片', prompt: 'vintage photography, film camera, light leaks, grain, 1970s aesthetic, warm tones, analog', icon: '📸' },
      { id: 'street', en: 'Street', zh: '街头摄影', prompt: 'street photography, candid moment, urban environment, natural light, documentary style, 35mm', icon: '🏙️' },
    ],
  },
  {
    id: 'anime-cartoon',
    en: 'Anime & Cartoon',
    zh: '动漫卡通',
    styles: [
      { id: 'anime', en: 'Anime', zh: '日系动漫', prompt: 'anime style, Studio Ghibli inspired, 2D animation, cel shaded, vibrant, hand-painted background', icon: '🌸' },
      { id: 'chibi', en: 'Chibi', zh: 'Q版', prompt: 'chibi style, cute proportions, big head small body, kawaii, adorable, SD character, pastel colors', icon: '🎀' },
      { id: 'manga', en: 'Manga', zh: '漫画', prompt: 'manga style, black and white, screentone, panel layout, Japanese comic art, expressive linework', icon: '📖' },
      { id: 'cartoon', en: 'Cartoon', zh: '美式卡通', prompt: 'cartoon style, western animation, exaggerated features, bold outlines, flat colors, Disney inspired', icon: '🐭' },
      { id: 'manhwa', en: 'Manhwa', zh: '韩漫风', prompt: 'manhwa style, Korean webtoon, clean lineart, soft shading, beautiful character design, vertical scroll', icon: '💫' },
    ],
  },
  {
    id: 'retro',
    en: 'Retro & Vintage',
    zh: '复古怀旧',
    styles: [
      { id: 'synthwave', en: 'Synthwave', zh: '合成波', prompt: 'synthwave, 80s aesthetic, neon colors, retrowave, outrun, grid lines, sunset gradient, retro futurism', icon: '🌴' },
      { id: 'vaporwave', en: 'Vaporwave', zh: '蒸汽波', prompt: 'vaporwave, glitch art, 90s internet aesthetic, pink and cyan, marble statues, tropical', icon: '🗿' },
      { id: 'pop-art', en: 'Pop Art', zh: '波普艺术', prompt: 'pop art, Roy Lichtenstein inspired, Ben-Day dots, bold colors, comic book style, halftone', icon: '🎯' },
      { id: 'art-deco', en: 'Art Deco', zh: '装饰艺术', prompt: 'art deco style, geometric patterns, gold accents, elegant, 1920s aesthetic, luxury, symmetrical', icon: '✨' },
      { id: 'steampunk', en: 'Steampunk', zh: '蒸汽朋克', prompt: 'steampunk, Victorian era, brass gears, clockwork, industrial revolution, copper pipes, mechanical', icon: '⚙️' },
    ],
  },
  {
    id: 'atmosphere',
    en: 'Atmosphere',
    zh: '氛围意境',
    styles: [
      { id: 'dreamy', en: 'Dreamy', zh: '梦幻', prompt: 'dreamlike, ethereal, soft focus, pastel colors, floating elements, fantasy atmosphere, magical glow', icon: '🌙' },
      { id: 'dark', en: 'Dark & Moody', zh: '暗黑', prompt: 'dark aesthetic, moody atmosphere, low key lighting, shadows, noir style, dramatic contrast, mysterious', icon: '🌑' },
      { id: 'cozy', en: 'Cozy', zh: '温馨', prompt: 'cozy atmosphere, warm lighting, hygge, comfortable, soft blankets, warm colors, inviting, cottagecore', icon: '🕯️' },
      { id: 'cyberpunk', en: 'Cyberpunk', zh: '赛博朋克', prompt: 'cyberpunk, neon lights, rain-slicked streets, futuristic city, holograms, high tech low life, Blade Runner', icon: '🌃' },
      { id: 'minimal', en: 'Minimalist', zh: '极简', prompt: 'minimalist, clean composition, negative space, elegant simplicity, fewer elements, serene, zen', icon: '🤍' },
    ],
  },
];

const MODELS = [
  { id: 'midjourney', label: 'Midjourney' },
  { id: 'sdxl', label: 'SDXL' },
  { id: 'dalle3', label: 'DALL-E 3' },
  { id: 'flux', label: 'Flux' },
];

interface HistoryItem {
  id: string;
  subject: string;
  prompt: string;
  style: string;
  timestamp: number;
}

export default function StyleGeneratorPage() {
  const { locale } = useParams<{ locale: string }>();
  const isZh = locale === 'zh';

  const [subject, setSubject] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StylePreset | null>(null);
  const [model, setModel] = useState('midjourney');
  const [output, setOutput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string>('artistic');
  const [outputLang, setOutputLang] = useOutputLang(locale);

  useEffect(() => {
    const saved = localStorage.getItem('sg-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleGenerate = useCallback(() => {
    if (!subject.trim() || !selectedStyle) return;
    setGenerating(true);

    setTimeout(() => {
      let prompt = subject.trim();
      prompt += ', ' + selectedStyle.prompt;

      if (model === 'midjourney') {
        prompt += ' --ar 16:9 --v 6.1 --style raw';
      } else if (model === 'flux') {
        prompt += ', professional, trending on artstation';
      }

      setOutput(prompt);
      setGenerating(false);

      const item: HistoryItem = {
        id: Date.now().toString(),
        subject: subject.trim(),
        prompt,
        style: selectedStyle.id,
        timestamp: Date.now(),
      };
      const updated = [item, ...history].slice(0, 20);
      setHistory(updated);
      localStorage.setItem('sg-history', JSON.stringify(updated));
    }, 500);
  }, [subject, selectedStyle, model, history]);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('sg-history');
  };

  const loadFromHistory = (item: HistoryItem) => {
    setSubject(item.subject);
    setOutput(item.prompt);
    setShowHistory(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="inline-flex rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-3.5 text-white shadow-lg shadow-pink-500/25">
          <Palette className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {isZh ? '风格生成器' : 'Style Generator'}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {isZh ? '选择艺术风格，输入主题，生成对应风格的提示词' : 'Pick a style, enter a subject, generate a styled prompt'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Style Picker + Input */}
        <div className="lg:col-span-2 space-y-4">
          {/* Subject input */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              {isZh ? '描述你的主题' : 'Describe your subject'}
            </label>
            <textarea
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={isZh ? '例如：一只猫在窗边睡觉、未来城市、魔法森林...' : 'e.g. a cat sleeping by the window, futuristic city, magical forest...'}
              rows={3}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all resize-none"
            />

            <div className="mt-3">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5">
                {isZh ? 'AI 模型' : 'AI Model'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      model === m.id
                        ? 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 ring-1 ring-pink-300'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Style Categories */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
              {isZh ? '选择风格' : 'Choose Style'}
            </h3>

            {STYLE_CATEGORIES.map((cat) => (
              <div key={cat.id} className="mb-3 last:mb-0">
                <button
                  onClick={() => setExpandedCat(expandedCat === cat.id ? '' : cat.id)}
                  className="flex items-center justify-between w-full text-left py-2"
                >
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {isZh ? cat.zh : cat.en}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${expandedCat === cat.id ? 'rotate-180' : ''}`} />
                </button>
                {expandedCat === cat.id && (
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    {cat.styles.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStyle(selectedStyle?.id === s.id ? null : s)}
                        className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
                          selectedStyle?.id === s.id
                            ? 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 ring-1 ring-pink-300 dark:ring-pink-700'
                            : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span className="text-base shrink-0">{s.icon}</span>
                        <span className="line-clamp-1">{isZh ? s.zh : s.en}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!subject.trim() || !selectedStyle || generating}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 hover:shadow-xl hover:from-pink-400 hover:to-rose-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {generating ? (isZh ? '生成中...' : 'Generating...') : (isZh ? '生成风格提示词' : 'Generate Styled Prompt')}
          </button>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-3 space-y-4">
          {output && selectedStyle ? (
            <>
              <div className="mb-2 flex justify-end">
                <OutputLanguageSelector value={outputLang} onChange={setOutputLang} locale={locale} />
              </div>
              {(outputLang === 'zh' || outputLang === 'bilingual') && (
                <div className="mb-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                  <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-2">
                    {isZh ? '中文解释' : 'Chinese Explanation'}
                  </h4>
                  {generateZhExplanation(output).map((tip: string, i: number) => (
                    <p key={i} className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{tip}</p>
                  ))}
                </div>
              )}
              {/* Style info */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 dark:bg-pink-900/50 px-3 py-1 text-sm font-medium text-pink-700 dark:text-pink-300">
                  <span>{selectedStyle.icon}</span>
                  {isZh ? selectedStyle.zh : selectedStyle.en}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs text-zinc-500">
                  {model.toUpperCase()}
                </span>
              </div>

              {/* Output */}
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                    <Gauge className="h-3 w-3" />
                    {Math.min(60 + output.split(/[,\s]+/).filter(Boolean).length, 100)}/100
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerate}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      {isZh ? '重新生成' : 'Regen'}
                    </button>
                    <button
                      onClick={() => copyText(output, 'main')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-pink-100 dark:bg-pink-900/30 px-3 py-1.5 text-xs font-medium text-pink-700 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
                    >
                      {copied === 'main' ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied === 'main' ? (isZh ? '已复制' : 'Copied!') : (isZh ? '复制' : 'Copy')}
                    </button>
                  </div>
                </div>
                <p className="text-sm font-mono leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                  {output}
                </p>
              </div>

              {/* Breakdown */}
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                  {isZh ? '提示词拆解' : 'Prompt Breakdown'}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-3">
                    <span className="text-xs text-zinc-400 shrink-0 mt-0.5">01</span>
                    <div>
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {isZh ? '主题' : 'Subject'}
                      </span>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{subject}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-pink-50 dark:bg-pink-950/20 p-3">
                    <span className="text-xs text-zinc-400 shrink-0 mt-0.5">02</span>
                    <div>
                      <span className="text-xs font-semibold text-pink-700 dark:text-pink-400">
                        {isZh ? '风格修饰' : 'Style Modifier'}
                      </span>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{selectedStyle.prompt}</p>
                    </div>
                  </div>
                  {(model === 'midjourney' || model === 'flux') && (
                    <div className="flex items-start gap-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-3">
                      <span className="text-xs text-zinc-400 shrink-0 mt-0.5">03</span>
                      <div>
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          {isZh ? '模型参数' : 'Model Params'}
                        </span>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                          {model === 'midjourney' ? '--ar 16:9 --v 6.1 --style raw' : ', professional, trending on artstation'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-12 text-center">
              <Palette className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-600" />
              <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">
                {isZh ? '输入主题并选择一种风格，然后点击生成' : 'Enter a subject, pick a style, then generate'}
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
                    <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 line-clamp-2">{item.prompt}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-zinc-400 line-clamp-1">{item.subject.slice(0, 40)}</span>
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
