// Client-side image analysis using Canvas API
// Extracts colors, composition, and suggests prompts

export interface ColorPalette {
  dominant: string;
  secondary: string[];
  mood: string;
  temperature: 'warm' | 'cool' | 'neutral';
}

export interface ImageAnalysis {
  palette: ColorPalette;
  composition: string;
  suggestedStyles: string[];
  suggestedLighting: string[];
  generatedPrompts: string[];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [128, 128, 128];
}

function getColorTemperature(r: number, g: number, b: number): 'warm' | 'cool' | 'neutral' {
  const warmth = (r - b) / 255;
  if (warmth > 0.15) return 'warm';
  if (warmth < -0.15) return 'cool';
  return 'neutral';
}

// K-means simplified color clustering
function extractDominantColors(
  pixels: Uint8ClampedArray,
  count: number = 6
): { color: string; weight: number }[] {
  const sampleSize = 100;
  const step = Math.floor(pixels.length / 4 / sampleSize);
  const samples: [number, number, number][] = [];

  for (let i = 0; i < pixels.length; i += step * 4) {
    if (samples.length >= sampleSize) break;
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    if (a > 128) {
      // Ignore transparent pixels
      samples.push([r, g, b]);
    }
  }

  // Simple bucket-based clustering by hue ranges
  const buckets: Map<string, { colors: number[][]; count: number }> = new Map();

  for (const [r, g, b] of samples) {
    // Quantize to 32 levels for bucketing
    const qr = Math.floor(r / 32) * 32;
    const qg = Math.floor(g / 32) * 32;
    const qb = Math.floor(b / 32) * 32;
    const key = `${qr},${qg},${qb}`;

    const existing = buckets.get(key);
    if (existing) {
      existing.colors.push([r, g, b]);
      existing.count++;
    } else {
      buckets.set(key, { colors: [[r, g, b]], count: 1 });
    }
  }

  // Sort by bucket size and compute average
  const sorted = Array.from(buckets.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, count);

  return sorted.map(([_, { colors }]) => {
    const avgR = Math.round(colors.reduce((s: number, c: number[]) => s + c[0], 0) / colors.length);
    const avgG = Math.round(colors.reduce((s: number, c: number[]) => s + c[1], 0) / colors.length);
    const avgB = Math.round(colors.reduce((s: number, c: number[]) => s + c[2], 0) / colors.length);
    return { color: rgbToHex(avgR, avgG, avgB), weight: colors.length };
  });
}

function detectComposition(pixels: Uint8ClampedArray, width: number, height: number): string {
  // Check rule of thirds: compare activity in center vs thirds
  const thirdW = Math.floor(width / 3);
  const thirdH = Math.floor(height / 3);

  let centerBrightness = 0;
  let edgeBrightness = 0;
  let centerPixels = 0;
  let edgePixels = 0;

  for (let y = 0; y < height; y += 20) {
    for (let x = 0; x < width; x += 20) {
      const idx = (y * width + x) * 4;
      const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;

      if (x > thirdW && x < thirdW * 2 && y > thirdH && y < thirdH * 2) {
        centerBrightness += brightness;
        centerPixels++;
      } else {
        edgeBrightness += brightness;
        edgePixels++;
      }
    }
  }

  const centerAvg = centerBrightness / Math.max(centerPixels, 1);
  const edgeAvg = edgeBrightness / Math.max(edgePixels, 1);
  const diff = Math.abs(centerAvg - edgeAvg) / 255;

  if (diff > 0.3 && centerAvg > edgeAvg) return 'center-weighted, strong focal point';
  if (diff > 0.3 && edgeAvg > centerAvg) return 'rule of thirds, balanced composition';
  return 'evenly distributed, panoramic composition';
}

function detectMood(palette: ColorPalette): string {
  const [r, g, b] = hexToRgb(palette.dominant);
  const brightness = (r + g + b) / 3;
  const saturation = Math.max(r, g, b) - Math.min(r, g, b);

  if (brightness < 80) return 'dark and moody';
  if (brightness > 200 && saturation < 30) return 'bright and airy';
  if (saturation > 100 && palette.temperature === 'warm') return 'vibrant and energetic';
  if (palette.temperature === 'cool') return 'calm and serene';
  return 'balanced and natural';
}

export async function analyzeImage(file: File): Promise<ImageAnalysis> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const maxDimension = 400;
      const scale = Math.min(maxDimension / img.width, maxDimension / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Extract colors
      const dominantColors = extractDominantColors(pixels, 6);
      const dominant = dominantColors[0]?.color || '#888888';
      const secondary = dominantColors.slice(1, 4).map((c) => c.color);

      const [dr, dg, db] = hexToRgb(dominant);
      const temperature = getColorTemperature(dr, dg, db);

      const palette: ColorPalette = {
        dominant,
        secondary,
        temperature,
        mood: detectMood({ dominant, secondary, temperature, mood: '' }),
      };

      // Detect composition
      const composition = detectComposition(pixels, canvas.width, canvas.height);

      // Suggest styles based on analysis
      const [r, g, b] = hexToRgb(dominant);
      const brightness = (r + g + b) / 3;
      const saturation = Math.max(r, g, b) - Math.min(r, g, b);

      const suggestedStyles: string[] = [];
      if (saturation > 80) {
        suggestedStyles.push('cinematic', 'digital');
      } else if (saturation < 40 && brightness > 150) {
        suggestedStyles.push('minimal', 'watercolor');
      } else if (brightness < 100) {
        suggestedStyles.push('cinematic', 'photorealistic');
      } else {
        suggestedStyles.push('photorealistic', 'digital');
      }

      const suggestedLighting: string[] = [];
      if (temperature === 'warm') {
        suggestedLighting.push('golden-hour', 'dramatic');
      } else if (temperature === 'cool') {
        suggestedLighting.push('neon', 'night');
      } else {
        suggestedLighting.push('studio', 'natural');
      }

      // Generate prompts based on analysis
      const paletteDesc = `${palette.temperature} tones, ${palette.mood}`;
      const generatedPrompts = [
        `${dominant} and ${secondary[0] || 'white'} color scheme, ${composition}, ${paletteDesc}, 8K, ultra-detailed`,
        `${composition}, professional photography, ${palette.temperature} color grading, masterpiece, sharp focus`,
        `stunning ${temperature === 'warm' ? 'golden hour' : 'cinematic'} lighting, ${paletteDesc}, highly detailed, award-winning composition`,
      ];

      resolve({
        palette,
        composition,
        suggestedStyles,
        suggestedLighting,
        generatedPrompts,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}
