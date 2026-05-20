// Template-based AI prompt generation engine
// Produces real, usable prompts for Midjourney, Stable Diffusion, DALL-E

export interface PromptOptions {
  subject: string;
  style?: string;
  quality?: string;
  lighting?: string;
  composition?: string;
  camera?: string;
  mood?: string;
  color?: string;
  detail?: string;
  negative?: string;
  model?: 'midjourney' | 'sdxl' | 'dalle3' | 'flux';
}

const styleModifiers: Record<string, string> = {
  cinematic: 'cinematic lighting, film grain, anamorphic lens, 35mm',
  anime: 'anime style, studio ghibli inspired, 2D animation, cel shaded, vibrant',
  photorealistic: 'photorealistic, hyperrealistic, 8K, highly detailed, sharp focus',
  watercolor: 'watercolor painting, soft brushstrokes, artistic, flowing colors',
  'oil-painting': 'oil painting, impasto texture, classical art style, rich pigments',
  '3d-render': '3D render, octane render, unreal engine 5, ray tracing, CGI',
  sketch: 'pencil sketch, hand-drawn, detailed linework, artistic',
  digital: 'digital art, concept art, artstation, trending on cgsociety',
  minimal: 'minimalist, clean composition, negative space, elegant simplicity',
  surreal: 'surreal art, dreamlike, Salvador Dali inspired, impossible geometry',
  retro: 'retro style, 80s aesthetic, synthwave, neon colors, grainy',
  'low-poly': 'low poly 3D, geometric shapes, minimalist 3D render, isometric',
};

const lightModifiers: Record<string, string> = {
  'golden-hour': 'golden hour, warm sunset light, long shadows, atmospheric haze',
  studio: 'professional studio lighting, three-point lighting, softbox',
  neon: 'neon lights, cyberpunk lighting, vibrant glow, dark ambiance',
  natural: 'natural daylight, diffused lighting, outdoor brightness',
  cinematic: 'cinematic lighting, dramatic shadows, rim lighting, volumetric light',
  night: 'moonlight, night scene, low key lighting, subtle illumination',
  backlit: 'backlighting, rim light, silhouette effect, ethereal glow',
  dramatic: 'dramatic lighting, chiaroscuro, high contrast shadows, Rembrandt lighting',
};

const cameraModifiers: Record<string, string> = {
  wide: 'wide-angle lens, expansive view, deep depth of field, 24mm',
  closeup: 'close-up shot, macro lens, shallow depth of field, bokeh, 85mm',
  portrait: 'portrait lens, 85mm, beautiful bokeh, sharp subject, blurred background',
  aerial: 'aerial view, drone shot, bird eye perspective, top-down',
  'dutch-angle': 'dutch angle, tilted composition, dynamic tension, cinematic',
  telephoto: 'telephoto lens, compressed perspective, 200mm, distant capture',
  fisheye: 'fisheye lens, 180 degree view, distorted perspective',
};

const qualityModifiers: Record<string, string> = {
  standard: 'high quality, detailed',
  high: '8K, ultra-detailed, masterpiece, professional photography',
  extreme: '8K UHD, hyperrealistic, ultra-detailed, award-winning, breathtaking, sharp focus',
  mobile: 'detailed, sharp, optimized for mobile aspect ratio',
};

export function generatePrompt(options: PromptOptions): string {
  const parts: string[] = [];

  // Subject is the core
  parts.push(options.subject.trim());

  // Style modifier
  if (options.style && styleModifiers[options.style]) {
    parts.push(styleModifiers[options.style]);
  }

  // Lighting
  if (options.lighting && lightModifiers[options.lighting]) {
    parts.push(lightModifiers[options.lighting]);
  }

  // Camera
  if (options.camera && cameraModifiers[options.camera]) {
    parts.push(cameraModifiers[options.camera]);
  }

  // Quality
  if (options.quality && qualityModifiers[options.quality]) {
    parts.push(qualityModifiers[options.quality]);
  }

  // Extra detail
  if (options.detail && options.detail.trim()) {
    parts.push(options.detail.trim());
  }

  // Compose final prompt
  let prompt = parts.join(', ');

  // Model-specific formatting
  if (options.model === 'midjourney') {
    // MJ uses --ar, --v etc
    prompt += ' --ar 16:9 --v 6.1 --style raw';
  } else if (options.model === 'flux') {
    prompt += ', professional, trending on artstation';
  }

  return prompt;
}

export function generateNegativePrompt(style?: string): string {
  const base = [
    'ugly', 'deformed', 'blurry', 'low quality', 'watermark',
    'text', 'signature', 'bad anatomy', 'extra limbs', 'mutated',
  ];

  const extras: Record<string, string[]> = {
    anime: ['3D render', 'realistic', 'photorealistic'],
    photorealistic: ['cartoon', 'anime', 'illustration', 'painting'],
    cinematic: ['flat lighting', 'boring composition'],
  };

  const all = style && extras[style] ? [...base, ...extras[style]] : base;
  return all.join(', ');
}

// Generate prompt variations
export function generateVariations(basePrompt: string, count: number = 3): string[] {
  const addons = [
    ', intricate details, professional composition',
    ', vibrant colors, stunning atmosphere',
    ', masterpiece quality, trending on artstation',
    ', ethereal lighting, dreamlike atmosphere',
    ', sharp focus, tack sharp, editorial photography',
  ];

  const variations: string[] = [basePrompt];
  for (let i = 1; i < count; i++) {
    variations.push(basePrompt + addons[i % addons.length]);
  }
  return variations;
}

// Estimate prompt quality score (for display)
export function estimatePromptQuality(prompt: string): number {
  let score = 50;
  const words = prompt.split(/[,\s]+/).filter(Boolean);
  if (words.length > 10) score += 10;
  if (words.length > 20) score += 10;
  if (words.length > 40) score += 10;
  if (/\b(8k|4k|hd|detailed|sharp|high quality|masterpiece)\b/i.test(prompt)) score += 10;
  if (/\b(lighting|cinematic|photorealistic|render|style)\b/i.test(prompt)) score += 10;
  if (/(--ar|--v|--style)/.test(prompt)) score += 5;
  return Math.min(score, 100);
}

// Parse prompt into tags/suggestions
export function extractKeywords(prompt: string): string[] {
  const keywords: string[] = [];
  const patterns = [
    /\b(cinematic|photorealistic|anime|oil.painting|watercolor|3d|digital.art|sketch)\b/gi,
    /\b(8k|4k|hd|uhd|high.resolution)\b/gi,
    /\b(portrait|landscape|close.up|wide.angle|aerial|macro)\b/gi,
    /\b(studio.lighting|natural.light|golden.hour|neon|night)\b/gi,
    /\b(midjourney|stable.diffusion|dall.e)\b/gi,
  ];
  for (const pattern of patterns) {
    const matches = prompt.match(pattern);
    if (matches) keywords.push(...matches);
  }
  return [...new Set(keywords.map((k) => k.toLowerCase()))];
}
