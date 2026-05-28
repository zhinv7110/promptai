// Bulk import prompts into Supabase
// Usage: node scripts/import-prompts.mjs [file.json]
// Default: reads from data/prompts.json

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('Load from .env.local or set as environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Schema ──────────────────────────────────────────────────────
const REQUIRED_FIELDS = ['title_en', 'title_zh', 'slug', 'category', 'prompt_text'];
const OPTIONAL_FIELDS = ['description_en', 'description_zh', 'description_ja', 'description_ko', 'title_ja', 'title_ko', 'tags', 'model', 'example_image_url', 'is_premium', 'is_featured', 'cover_image', 'gallery_images', 'image_alt', 'aspect_ratio', 'negative_prompt', 'generation_settings'];

// Known existing columns in DB — auto-strip unknown columns
// Run supabase/migrations/008_visual_content.sql when adding new columns
const KNOWN_COLUMNS = new Set([
  'id', 'title_en', 'title_zh', 'slug', 'description_en', 'description_zh',
  'category', 'tags', 'prompt_text', 'model', 'example_image_url',
  'is_premium', 'cover_image', 'gallery_images', 'image_alt',
  'aspect_ratio', 'negative_prompt', 'generation_settings', 'is_featured',
  'likes_count', 'views_count', 'created_at', 'updated_at'
]);

// ── Main ────────────────────────────────────────────────────────
async function main() {
  const filePath = resolve(process.argv[2] || 'data/prompts.json');

  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    console.log('Expected JSON array format:');
    console.log(JSON.stringify([{
      title_en: 'My Prompt',
      title_zh: '我的提示词',
      slug: 'my-prompt-slug',
      category: 'portrait',
      prompt_text: 'detailed prompt text here...',
      description_en: 'Optional description',
      description_zh: '可选描述',
      tags: ['tag1', 'tag2'],
      model: 'midjourney',
      cover_image: 'https://example.com/image.jpg',
      gallery_images: ['https://example.com/gallery1.jpg'],
      image_alt: 'Description of image',
      negative_prompt: 'ugly, deformed...',
      generation_settings: { steps: 30, cfg_scale: 7 },
      is_premium: false,
      is_featured: false,
    }], null, 2));
    process.exit(1);
  }

  const raw = readFileSync(filePath, 'utf-8');
  let prompts;
  try {
    prompts = JSON.parse(raw);
    if (!Array.isArray(prompts)) throw new Error('Expected JSON array');
  } catch (e) {
    console.error('Invalid JSON:', e.message);
    process.exit(1);
  }

  console.log(`Found ${prompts.length} prompts in ${filePath}`);

  // Validate and clean
  const valid = [];
  const errors = [];
  for (let i = 0; i < prompts.length; i++) {
    const p = prompts[i];
    const missing = REQUIRED_FIELDS.filter((f) => !p[f]);
    if (missing.length > 0) {
      errors.push(`Row ${i + 1}: missing ${missing.join(', ')}`);
      continue;
    }
    // Fill defaults
    valid.push({
      title_en: p.title_en,
      title_zh: p.title_zh,
      title_ja: p.title_ja || null,
      title_ko: p.title_ko || null,
      slug: p.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      description_en: p.description_en || null,
      description_zh: p.description_zh || null,
      description_ja: p.description_ja || null,
      description_ko: p.description_ko || null,
      category: p.category,
      tags: p.tags || [],
      prompt_text: p.prompt_text,
      model: p.model || 'midjourney',
      example_image_url: p.example_image_url || null,
      cover_image: p.cover_image || null,
      gallery_images: p.gallery_images || null,
      image_alt: p.image_alt || null,
      aspect_ratio: p.aspect_ratio || null,
      negative_prompt: p.negative_prompt || null,
      generation_settings: p.generation_settings || null,
      is_premium: p.is_premium || false,
      is_featured: p.is_featured || false,
    });
  }

  if (errors.length > 0) {
    console.log('Validation errors:');
    errors.forEach((e) => console.log('  -', e));
  }

  if (valid.length === 0) {
    console.log('No valid prompts to import.');
    process.exit(1);
  }

  console.log(`Importing ${valid.length} valid prompts...`);

  // Batch insert (upsert by slug)
  const batchSize = 50;
  let inserted = 0;
  let updated = 0;

  for (let i = 0; i < valid.length; i += batchSize) {
    let batch = valid.slice(i, i + batchSize);
    // Strip columns that don't exist in DB
    batch = batch.map((row) => {
      const clean = {};
      for (const [k, v] of Object.entries(row)) {
        if (KNOWN_COLUMNS.has(k)) clean[k] = v;
      }
      return clean;
    });
    const { data, error } = await supabase
      .from('prompts')
      .upsert(batch, { onConflict: 'slug', ignoreDuplicates: false })
      .select('slug');

    if (error) {
      console.error(`Batch ${i}-${i + batch.length} failed:`, error.message);
    } else {
      inserted += data?.length || 0;
      const start = i + 1;
      const end = Math.min(i + batchSize, valid.length);
      console.log(`  [${start}-${end}] OK (${data?.length || 0} rows)`);
    }
  }

  console.log(`\nDone! ${inserted} prompts imported/updated.`);
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
