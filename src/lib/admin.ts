// Admin utilities — auth, CRUD helpers
import { createServerSupabase } from '@/lib/supabase/server';

export async function verifyAdmin(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  return password === adminPassword;
}

// ── Prompts CRUD ─────────────────────────────────────────────────

export async function adminGetPrompts(filters?: {
  search?: string;
  category?: string;
  page?: number;
  perPage?: number;
}) {
  const supabase = await createServerSupabase();
  const perPage = filters?.perPage || 20;
  const page = filters?.page || 1;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase.from('prompts').select('*', { count: 'exact' });

  if (filters?.search) {
    const q = `%${filters.search}%`;
    query = query.or(`title_en.ilike.${q},title_zh.ilike.${q},prompt_text.ilike.${q}`);
  }
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], total: count || 0, page, perPage };
}

export async function adminGetPrompt(id: string) {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('prompts').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export async function adminCreatePrompt(prompt: Record<string, unknown>) {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('prompts').insert(prompt).select('id').single();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminUpdatePrompt(id: string, updates: Record<string, unknown>) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.from('prompts').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function adminDeletePrompt(id: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.from('prompts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Blog CRUD ────────────────────────────────────────────────────

export async function adminGetBlogPosts(filters?: { search?: string; page?: number; perPage?: number }) {
  const supabase = await createServerSupabase();
  const perPage = filters?.perPage || 20;
  const page = filters?.page || 1;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase.from('blog_posts').select('*', { count: 'exact' });

  if (filters?.search) {
    const q = `%${filters.search}%`;
    query = query.or(`title_en.ilike.${q},title_zh.ilike.${q}`);
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], total: count || 0, page, perPage };
}

export async function adminGetBlogPost(id: string) {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export async function adminCreateBlogPost(post: Record<string, unknown>) {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('blog_posts').insert(post).select('id').single();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminUpdateBlogPost(id: string, updates: Record<string, unknown>) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.from('blog_posts').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function adminDeleteBlogPost(id: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Bulk operations ──────────────────────────────────────────────

export async function adminBulkInsertPrompts(prompts: Record<string, unknown>[]) {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('prompts').upsert(prompts, { onConflict: 'slug' }).select('id');
  if (error) throw new Error(error.message);
  return data;
}

export async function adminBulkDeletePrompts(ids: string[]) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.from('prompts').delete().in('id', ids);
  if (error) throw new Error(error.message);
}

export async function adminBulkPublishBlogPosts(ids: string[]) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.from('blog_posts').update({ published: true, updated_at: new Date().toISOString() }).in('id', ids);
  if (error) throw new Error(error.message);
}
