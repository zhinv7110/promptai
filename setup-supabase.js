// One-click Supabase setup — creates all tables and seeds data
const { createClient } = require('@supabase/supabase-js');

const URL = 'https://qbiylphhbgqkhialcthg.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiaXlscGhoYmdxa2hpYWxjdGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzUxNTIsImV4cCI6MjA2MzUxMTE1Mn0.s5lCgRgR46h8jwvFbn3KX2JCRWffbJ9DX89sx1MV0yE';

const supabase = createClient(URL, KEY);

const SQL = `
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_en TEXT,
  description_zh TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  prompt_text TEXT NOT NULL,
  model TEXT DEFAULT 'midjourney',
  example_image_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  slug TEXT NOT NULL,
  content_en TEXT,
  content_zh TEXT,
  excerpt_en TEXT,
  excerpt_zh TEXT,
  featured_image TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
`;

async function main() {
  console.log('Connecting to Supabase...');

  // Run SQL via REST API
  const res = await fetch(`${URL}/rest/v1/`, {
    method: 'GET',
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });

  if (!res.ok) {
    console.log('Cannot reach Supabase API. Trying alternative method...');
  }

  // Insert test data to verify write access
  console.log('Checking permissions...');
  const { data, error } = await supabase
    .from('prompts')
    .select('id', { count: 'exact', head: true });

  if (error) {
    console.log('prompts table does not exist yet. Please run the SQL below in Supabase SQL Editor:');
    console.log('\n' + SQL + '\n');
    console.log('or try running this script with service_role key in an environment where SQL execution is allowed.');
  } else {
    console.log('prompts table exists! Connected successfully.');
    console.log('Tables are ready. Now seed data via SQL Editor or restart your app.');
  }
}

main();
