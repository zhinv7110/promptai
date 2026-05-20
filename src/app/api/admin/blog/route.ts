import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const id = searchParams.get('id');
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '15');
  const supabase = await createServerSupabase();

  // Single post
  if (id) {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
  }

  // List
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  let query = supabase.from('blog_posts').select('*', { count: 'exact' });
  if (search) {
    const q = `%${search}%`;
    query = query.or(`title_en.ilike.${q},title_zh.ilike.${q}`);
  }
  query = query.order('created_at', { ascending: false }).range(from, to);
  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, total: count || 0, page, perPage });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('blog_posts').insert(body).select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, id: data.id });
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const body = await request.json();
  const supabase = await createServerSupabase();
  const { error } = await supabase.from('blog_posts').update({ ...body, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = await createServerSupabase();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
