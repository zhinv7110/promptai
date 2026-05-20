-- Core prompts table
CREATE TABLE prompts (
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

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT
);

-- Junction: prompt <-> category
CREATE TABLE prompt_categories (
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, category_id)
);

-- Blog posts (for future CMS expansion)
CREATE TABLE blog_posts (
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

-- Indexes
CREATE INDEX idx_prompts_slug ON prompts(slug);
CREATE INDEX idx_prompts_category ON prompts(category);
CREATE INDEX idx_prompts_tags ON prompts USING GIN(tags);
CREATE INDEX idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX idx_prompts_likes ON prompts(likes_count DESC);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);

-- Seed: default categories
INSERT INTO categories (name_en, name_zh, slug, icon) VALUES
  ('Portrait', '人像', 'portrait', 'User'),
  ('Landscape', '风景', 'landscape', 'Landscape'),
  ('Fantasy', '奇幻', 'fantasy', 'Sword'),
  ('Anime', '动漫', 'anime', 'Drama'),
  ('Architecture', '建筑', 'architecture', 'Building'),
  ('Abstract', '抽象', 'abstract', 'Shapes'),
  ('Photorealistic', '写实', 'photorealistic', 'Camera'),
  ('Concept Art', '概念艺术', 'concept-art', 'PenLine');
