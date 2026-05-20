// Bulk import blog posts from MDX files into Supabase
// Usage: node scripts/import-blog.mjs [content/blog/ directory]
// Default: reads from content/blog/

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { resolve, join, extname, basename } from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Frontmatter parser ──────────────────────────────────────────
function parseMdx(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta = {};
  const lines = match[1].split('\n');
  let currentKey = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('- ') && currentKey) {
      const val = trimmed.slice(2).replace(/^['"](.*)['"]$/, '$1');
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = [];
      meta[currentKey].push(val);
      continue;
    }
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    currentKey = trimmed.slice(0, colonIdx).trim();
    let val = trimmed.slice(colonIdx + 1).trim();
    val = val.replace(/^['"](.*)['"]$/, '$1');
    if (val.startsWith('[') && val.endsWith(']')) {
      meta[currentKey] = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^['"](.*)['"]$/, '$1'));
    } else {
      meta[currentKey] = val;
    }
  }
  return { meta, body: match[2] };
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  const baseDir = resolve(process.argv[2] || 'content/blog');

  if (!existsSync(baseDir)) {
    console.error(`Directory not found: ${baseDir}`);
    console.log('Expected structure: content/blog/{en,zh}/*.mdx');
    process.exit(1);
  }

  // Group mdx files by slug across locales
  const posts = [];
  for (const locale of ['en', 'zh']) {
    const localeDir = join(baseDir, locale);
    if (!existsSync(localeDir)) continue;

    const files = readdirSync(localeDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
    for (const file of files) {
      const slug = basename(file, extname(file));
      const raw = readFileSync(join(localeDir, file), 'utf-8');
      const { meta, body } = parseMdx(raw);

      let existing = posts.find((p) => p.slug === slug);
      if (!existing) {
        existing = { slug };
        posts.push(existing);
      }

      if (locale === 'en') {
        existing.title_en = meta.title || slug;
        existing.excerpt_en = meta.excerpt || '';
        existing.content_en = body;
        existing.date = meta.date || new Date().toISOString().split('T')[0];
        existing.tags = meta.tags || [];
      } else {
        existing.title_zh = meta.title || slug;
        existing.excerpt_zh = meta.excerpt || '';
        existing.content_zh = body;
        if (meta.date) existing.date = meta.date;
        if (meta.tags) existing.tags = meta.tags;
      }
    }
  }

  console.log(`Found ${posts.length} blog posts across locales`);

  // Fill missing locale fields
  for (const post of posts) {
    post.title_en = post.title_en || post.title_zh || post.slug;
    post.title_zh = post.title_zh || post.title_en || post.slug;
    post.excerpt_en = post.excerpt_en || '';
    post.excerpt_zh = post.excerpt_zh || '';
    post.content_en = post.content_en || '';
    post.content_zh = post.content_zh || '';
    post.published = true;
  }

  // Upsert
  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(posts, { onConflict: 'slug', ignoreDuplicates: false })
    .select('slug');

  if (error) {
    console.error('Import failed:', error.message);
  } else {
    console.log(`Done! ${data?.length || 0} blog posts imported/updated.`);
  }
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
