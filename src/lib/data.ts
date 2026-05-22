// Server-side data layer — Supabase with caching and fallback
// All fetch functions return real data when Supabase is configured,
// falling back to static sample data when unavailable.

import { createServerSupabase } from '@/lib/supabase/server';
import { samplePrompts } from '@/lib/sample-prompts';
import { getBlogPosts as getStaticBlogPosts, getBlogPost as getStaticBlogPost } from '@/lib/blog';
import type { Prompt, BlogPost } from '@/types';

// ── Simple in-memory cache ──────────────────────────────────────
const cache = new Map<string, { data: unknown; ts: number }>();
const TTL = 5_000; // 5 seconds (was 60s)

function cached<T>(key: string, factory: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < TTL) return Promise.resolve(hit.data as T);
  return factory().then((data) => {
    if (data) cache.set(key, { data, ts: Date.now() });
    return data;
  });
}

function invalidate(pattern: string) {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) cache.delete(key);
  }
}

// ── Supabase availability check ────────────────────────────────
let _supabaseAvailable: boolean | null = null;

async function isSupabaseAvailable(): Promise<boolean> {
  if (_supabaseAvailable !== null) return _supabaseAvailable;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
    console.log('[Supabase] URL not configured, using fallback data');
    _supabaseAvailable = false;
    return false;
  }

  // Static export: skip Supabase
  if (typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build') {
    _supabaseAvailable = false;
    return false;
  }

  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.from('prompts').select('id', { count: 'exact', head: true });
    if (error) {
      console.log('[Supabase] Connection failed:', error.message || error.code || 'unknown');
      _supabaseAvailable = false;
      return false;
    }
    console.log('[Supabase] Connected! prompts count:', data?.length ?? 'unknown');
    _supabaseAvailable = true;
    return true;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log('[Supabase] Error:', msg);
    _supabaseAvailable = false;
    return false;
  }
}

// ── Prompts ─────────────────────────────────────────────────────

export async function getPrompts(filters?: {
  search?: string;
  category?: string;
  tags?: string[];
  model?: string;
  locale?: string;
  limit?: number;
  orderBy?: 'likes_count' | 'views_count' | 'created_at';
}): Promise<Prompt[]> {
  return cached(`prompts:${JSON.stringify(filters)}`, async () => {
    if (!(await isSupabaseAvailable())) {
      // Fallback to sample data
      const { filterPrompts } = await import('@/lib/sample-prompts');
      let result = filterPrompts(samplePrompts, filters || {});
      if (filters?.orderBy === 'likes_count') result.sort((a, b) => b.likes_count - a.likes_count);
      if (filters?.orderBy === 'views_count') result.sort((a, b) => b.views_count - a.views_count);
      if (filters?.limit) result = result.slice(0, filters.limit);
      return result;
    }

    const supabase = await createServerSupabase();
    let query = supabase.from('prompts').select('*');

    if (filters?.search) {
      const q = `%${filters.search}%`;
      query = query.or(`title_en.ilike.${q},title_zh.ilike.${q},title_ja.ilike.${q},title_ko.ilike.${q},prompt_text.ilike.${q}`);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.model) {
      query = query.eq('model', filters.model);
    }
    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    const orderBy = filters?.orderBy || 'created_at';
    query = query.order(orderBy, { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase getPrompts error:', error.message);
      return samplePrompts;
    }

    return (data as Prompt[]) || [];
  });
}

export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  return cached(`prompt:${slug}`, async () => {
    if (!(await isSupabaseAvailable())) {
      return samplePrompts.find((p) => p.slug === slug) || null;
    }

    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.warn('Supabase getPromptBySlug error:', error.message);
      return samplePrompts.find((p) => p.slug === slug) || null;
    }

    return data as Prompt;
  });
}

export async function getPopularPrompts(limit: number = 4): Promise<Prompt[]> {
  return getPrompts({ limit, orderBy: 'likes_count' });
}

export async function getTrendingPrompts(limit: number = 6): Promise<Prompt[]> {
  return getPrompts({ limit, orderBy: 'views_count' });
}

export async function getFeaturedPrompts(limit: number = 8): Promise<Prompt[]> {
  return cached(`featured:${limit}`, async () => {
    if (!(await isSupabaseAvailable())) {
      const featured = samplePrompts.slice(0, limit);
      return featured;
    }
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) {
      console.warn('Supabase getFeaturedPrompts error:', error.message);
      return samplePrompts.slice(0, limit);
    }
    return (data as Prompt[]) || [];
  });
}

// ── Blog ────────────────────────────────────────────────────────

export async function getBlogPosts(locale?: string): Promise<BlogPost[]> {
  return cached(`blog:list:${locale || 'all'}`, async () => {
    if (!(await isSupabaseAvailable())) {
      const staticPosts = getStaticBlogPosts(locale || 'en');
      return staticPosts.map((p) => ({
        slug: p.slug,
        title_en: p.title,
        title_zh: p.title,
        title_ja: p.title,
        title_ko: p.title,
        excerpt_en: p.excerpt,
        excerpt_zh: p.excerpt,
        excerpt_ja: p.excerpt,
        excerpt_ko: p.excerpt,
        date: p.date,
        tags: p.tags,
        featured_image: null as string | null,
        content_en: '',
        content_zh: '',
        content_ja: '',
        content_ko: '',
      })) as BlogPost[];
    }

    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title_en, title_zh, title_ja, title_ko, excerpt_en, excerpt_zh, excerpt_ja, excerpt_ko, tags, created_at, featured_image')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase getBlogPosts error:', error.message);
      const staticPosts = getStaticBlogPosts(locale || 'en');
      return staticPosts.map((p) => ({
        slug: p.slug,
        title_en: p.title,
        title_zh: p.title,
        title_ja: p.title,
        title_ko: p.title,
        excerpt_en: p.excerpt,
        excerpt_zh: p.excerpt,
        excerpt_ja: p.excerpt,
        excerpt_ko: p.excerpt,
        date: p.date,
        tags: p.tags,
        featured_image: null as string | null,
        content_en: '',
        content_zh: '',
        content_ja: '',
        content_ko: '',
      })) as BlogPost[];
    }

    return (data || []).map((row: Record<string, unknown>) => ({
      slug: row.slug as string,
      title_en: row.title_en as string,
      title_zh: row.title_zh as string,
      title_ja: row.title_ja as string || '',
      title_ko: row.title_ko as string || '',
      excerpt_en: row.excerpt_en as string,
      excerpt_zh: row.excerpt_zh as string,
      excerpt_ja: row.excerpt_ja as string || '',
      excerpt_ko: row.excerpt_ko as string || '',
      date: row.created_at as string,
      tags: row.tags as string[],
      featured_image: row.featured_image as string | null,
      content_en: '',
      content_zh: '',
      content_ja: '',
      content_ko: '',
    })) as BlogPost[];
  });
}

export async function getBlogPost(slug: string, locale?: string): Promise<BlogPost | null> {
  const key = `blog:${slug}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < TTL) return hit.data as BlogPost;

  const result = await (async () => {
    if (!(await isSupabaseAvailable())) {
      const staticPost = getStaticBlogPost(slug, locale || 'en');
      if (!staticPost) return null;
      return {
        slug: staticPost.meta.slug,
        title_en: staticPost.meta.title,
        title_zh: staticPost.meta.title,
        title_ja: staticPost.meta.title,
        title_ko: staticPost.meta.title,
        excerpt_en: staticPost.meta.excerpt,
        excerpt_zh: staticPost.meta.excerpt,
        excerpt_ja: staticPost.meta.excerpt,
        excerpt_ko: staticPost.meta.excerpt,
        date: staticPost.meta.date,
        tags: staticPost.meta.tags,
        featured_image: null as string | null,
        content_en: staticPost.content,
        content_zh: staticPost.content,
        content_ja: staticPost.content,
        content_ko: staticPost.content,
      } as BlogPost;
    }

    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.warn('Supabase getBlogPost error:', error.message);
      const staticPost = getStaticBlogPost(slug, locale || 'en');
      if (!staticPost) return null;
      return {
        slug: staticPost.meta.slug,
        title_en: staticPost.meta.title,
        title_zh: staticPost.meta.title,
        excerpt_en: staticPost.meta.excerpt,
        excerpt_zh: staticPost.meta.excerpt,
        date: staticPost.meta.date,
        tags: staticPost.meta.tags,
        featured_image: null as string | null,
        content_en: staticPost.content,
        content_zh: staticPost.content,
      } as BlogPost;
    }

    return {
      slug: data.slug as string,
      title_en: data.title_en as string,
      title_zh: data.title_zh as string,
      title_ja: data.title_ja as string || '',
      title_ko: data.title_ko as string || '',
      excerpt_en: data.excerpt_en as string,
      excerpt_zh: data.excerpt_zh as string,
      excerpt_ja: data.excerpt_ja as string || '',
      excerpt_ko: data.excerpt_ko as string || '',
      date: data.created_at as string,
      tags: data.tags as string[],
      featured_image: data.featured_image as string | null,
      content_en: data.content_en as string,
      content_zh: data.content_zh as string,
      content_ja: data.content_ja as string || '',
      content_ko: data.content_ko as string || '',
    } as BlogPost;
  })();

  if (result) cache.set(key, { data: result, ts: Date.now() });
  return result;
}

// ── Clear cache (call after mutations) ──────────────────────────
export { invalidate as invalidateCache };
