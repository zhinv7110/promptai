// Shared language/prompt generation utilities

export type OutputLang = 'en' | 'zh' | 'bilingual';

const STORAGE_KEY = 'thaumary-output-lang';

export function getOutputLang(): OutputLang {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'en' || saved === 'zh' || saved === 'bilingual') return saved;
  return 'en';
}

export function saveOutputLang(lang: OutputLang) {
  localStorage.setItem(STORAGE_KEY, lang);
}

// Chinese prompt explanation templates
const ZH_TEMPLATES: Record<string, string[]> = {
  portrait: [
    '这是一组高质量的人物肖像摄影提示词，强调自然光线与专业构图。',
    '适合生成具有电影质感的人物肖像作品，注重面部细节与背景虚化。',
  ],
  landscape: [
    '这是一组风景类AI图像生成提示词，营造宏大的视觉效果。',
    '适合生成广阔壮丽的自然或城市场景，强调光线与氛围。',
  ],
  fantasy: [
    '这是一组奇幻风格提示词，融合魔法元素与超现实视觉效果。',
    '适合生成充满想象力的奇幻场景，营造神秘梦幻的氛围。',
  ],
  anime: [
    '这是一组动漫风格提示词，融合日式动画美学与手绘质感。',
    '适合生成具有吉卜力风格或新海诚风格的动画画面。',
  ],
  architecture: [
    '这是一组建筑空间类提示词，强调极简设计与自然光线。',
    '适合生成现代建筑室内外效果图，突出材质与光影。',
  ],
  abstract: [
    '这是一组抽象艺术风格提示词，注重色彩流动与视觉冲击。',
    '适合生成具有画廊品质的抽象艺术作品。',
  ],
  photorealistic: [
    '这是一组写实风格提示词，追求极致真实感与商业级画质。',
    '适合生成产品摄影或超写实渲染作品。',
  ],
  'concept-art': [
    '这是一组概念艺术提示词，适合游戏与电影美术设计。',
    '适合生成具有ArtStation品质的概念设计与世界观构建。',
  ],
};

const ZH_GENERIC: string[] = [
  '✨ AI提示词已优化，可直接复制使用',
  '💡 复制提示词到Midjourney / Stable Diffusion / DALL-E中即可生成',
  '📐 建议搭配负面提示词使用，获得更干净的生成结果',
  '🎨 可根据需要调整参数（如 --ar 16:9 设置宽高比）',
];

// Generate Chinese explanation for a prompt
export function generateZhExplanation(prompt: string, category?: string): string[] {
  const tips: string[] = [];

  // Add category-specific explanation
  if (category && ZH_TEMPLATES[category]) {
    const templates = ZH_TEMPLATES[category];
    tips.push(templates[Math.floor(Math.random() * templates.length)]);
  } else {
    // Auto-detect from prompt keywords
    if (/portrait|face|person|model/i.test(prompt)) {
      tips.push(ZH_TEMPLATES['portrait'][0]);
    } else if (/landscape|mountain|ocean|city|night/i.test(prompt)) {
      tips.push(ZH_TEMPLATES['landscape'][0]);
    } else if (/fantasy|magic|dragon|enchanted/i.test(prompt)) {
      tips.push(ZH_TEMPLATES['fantasy'][0]);
    } else if (/anime|ghibli|manga|cartoon/i.test(prompt)) {
      tips.push(ZH_TEMPLATES['anime'][0]);
    } else if (/architecture|interior|building/i.test(prompt)) {
      tips.push(ZH_TEMPLATES['architecture'][0]);
    } else {
      tips.push(ZH_GENERIC[0]);
    }
  }

  // Add generic tips
  tips.push(ZH_GENERIC[Math.floor(Math.random() * ZH_GENERIC.length)]);
  return tips;
}

// Parse prompt into sections
export function parsePromptSections(prompt: string): {
  subject: string;
  modifiers: string[];
} {
  const parts = prompt.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return { subject: '', modifiers: [] };
  return {
    subject: parts[0],
    modifiers: parts.slice(1),
  };
}

// Truncated Chinese translation of prompt (mock)
export function translatePromptToZh(prompt: string): string {
  // Since we can't call an AI API, generate a descriptive note
  const parts = parsePromptSections(prompt);
  const count = parts.modifiers.length;
  return `【提示词翻译】主主题：${parts.subject}。包含${count}个修饰关键词，涵盖风格、光线、构图、画质等方面。建议直接使用英文原版获得最佳生成效果。`;
}
