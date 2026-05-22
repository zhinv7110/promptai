// Apply SQL migration via Supabase REST API
// Usage: node scripts/apply-migration.mjs supabase/migrations/008_visual_content.sql

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://epypxxzmwskhbycbhuey.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_mbU-AU62hzaFExIiS5tOKw_pYjlp7Gt';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const filePath = resolve(process.argv[2] || 'supabase/migrations/008_visual_content.sql');
const sql = readFileSync(filePath, 'utf-8');

// Split by semicolons, filter empty
const statements = sql
  .split(';')
  .map((s) => s.trim())
  .filter((s) => s.length > 0 && !s.startsWith('--') && !s.startsWith('SELECT supabase'));

async function main() {
  for (const stmt of statements) {
    console.log(`Executing: ${stmt.slice(0, 80)}...`);
    const { error } = await supabase.rpc('exec_sql', { sql: stmt }).maybeSingle();

    if (error) {
      // Try raw SQL via REST
      const { error: restError } = await supabase
        .from('_sql')
        .insert({ query: stmt })
        .maybeSingle();

      if (restError) {
        console.log(`  Note: ${error.message || restError.message}`);
        console.log('  This may need to be run in Supabase SQL Editor.');
      }
    } else {
      console.log('  OK');
    }
  }
  console.log('\nMigration applied. If any statements failed, run the SQL file in Supabase Dashboard SQL Editor.');
}

main().catch((e) => console.error('Fatal:', e.message));
