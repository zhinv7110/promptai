import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File too large' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const supabase = await createServerSupabase();
  const { error } = await supabase.storage
    .from('prompt-images')
    .upload(path, buffer, { contentType: file.type, cacheControl: '31536000' });

  if (error) {
    // If bucket doesn't exist, try gallery bucket
    const { error: err2 } = await supabase.storage
      .from('prompt-gallery')
      .upload(path, buffer, { contentType: file.type, cacheControl: '31536000' });

    if (err2) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: urlData } = supabase.storage.from('prompt-gallery').getPublicUrl(path);
    return NextResponse.json({ url: urlData.publicUrl });
  }

  const { data: urlData } = supabase.storage.from('prompt-images').getPublicUrl(path);
  return NextResponse.json({ url: urlData.publicUrl });
}
