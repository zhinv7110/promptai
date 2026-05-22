// Quick script to check existing columns and add missing ones via direct SQL
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const URL = 'https://epypxxzmwskhbycbhuey.supabase.co';
const KEY = 'sb_publishable_mbU-AU62hzaFExIiS5tOKw_pYjlp7Gt';

const supabase = createClient(URL, KEY);

async function main() {
  // Check which columns exist
  const { data, error } = await supabase.from('prompts').select('*').limit(1);
  if (error) {
    console.error('Cannot query prompts:', error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('No data in prompts table yet.');
    process.exit(0);
  }

  const existingColumns = Object.keys(data[0]);
  console.log('Existing columns:', existingColumns.join(', '));

  const needed = ['cover_image', 'gallery_images', 'image_alt', 'aspect_ratio', 'negative_prompt', 'generation_settings', 'is_featured'];
  const missing = needed.filter((c) => !existingColumns.includes(c));

  if (missing.length === 0) {
    console.log('All required columns exist. Proceeding with import...');
    process.exit(0);
  }

  console.log('\nMissing columns:', missing.join(', '));
  console.log('\nPlease run the following SQL in Supabase Dashboard SQL Editor:');
  console.log(readFileSync(resolve('supabase/migrations/008_visual_content.sql'), 'utf-8'));

  // Try to add columns via REST (this may fail with anon key)
  console.log('\nAttempting to add columns via REST...');
  for (const col of missing) {
    const type = col === 'generation_settings' ? 'jsonb' : col === 'gallery_images' ? 'text[]' : col === 'is_featured' ? 'boolean default false' : 'text';
    const sql = `ALTER TABLE prompts ADD COLUMN IF NOT EXISTS ${col} ${type}`;

    // Try via rpc
    const { error: rpcErr } = await supabase.rpc('exec_sql', { query: sql });
    if (rpcErr) {
      console.log(`  ${col}: RPC failed (${rpcErr.message}) — use SQL Editor`);
    } else {
      console.log(`  ${col}: added OK`);
    }
  }
}

main().catch(console.error);
