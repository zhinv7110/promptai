export const SITE_NAME = 'Thaumary AI';
export const SITE_URL = 'https://thaumary.ai';
export const DEFAULT_LOCALE = 'en';

export const TOOLS = [
  {
    id: 'prompt-generator',
    tKey: 'promptGenerator',
    icon: 'Sparkles',
    href: '/prompt-generator',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'prompt-enhancer',
    tKey: 'promptEnhancer',
    icon: 'Wand2',
    href: '/prompt-enhancer',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'style-generator',
    tKey: 'styleGenerator',
    icon: 'Palette',
    href: '/style-generator',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'image-analyzer',
    tKey: 'imageAnalyzer',
    icon: 'ScanEye',
    href: '/image-analyzer',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'negative-prompt',
    tKey: 'negativePrompt',
    icon: 'ShieldX',
    href: '/negative-prompt',
    color: 'from-emerald-500 to-teal-600',
  },
] as const;

export const CATEGORIES = [
  { slug: 'portrait', icon: 'User' },
  { slug: 'landscape', icon: 'Landscape' },
  { slug: 'fantasy', icon: 'Sword' },
  { slug: 'anime', icon: 'Drama' },
  { slug: 'architecture', icon: 'Building' },
  { slug: 'abstract', icon: 'Shapes' },
  { slug: 'photorealistic', icon: 'Camera' },
  { slug: 'concept-art', icon: 'PenLine' },
] as const;
