import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

// GET /api/admin/prompts — list with search, category filter, pagination
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '15');
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const supabase = await createServerSupabase();
  let query = supabase.from('prompts').select('*', { count: 'exact' });

  if (search) {
    const q = `%${search}%`;
    query = query.or(`title_en.ilike.${q},title_zh.ilike.${q},prompt_text.ilike.${q}`);
  }
  if (category) query = query.eq('category', category);

  query = query.order('created_at', { ascending: false }).range(from, to);
  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, total: count || 0, page, perPage });
}

// POST /api/admin/prompts — create
export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('prompts').insert(body).select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, id: data.id });
}

// DELETE /api/admin/prompts — delete by id
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = await createServerSupabase();
  const { error } = await supabase.from('prompts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
