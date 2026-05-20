-- Enable RLS on all tables
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
-- Allow public read access to prompts
CREATE POLICY "Public read prompts" ON prompts FOR SELECT USING (true);

-- Allow public read access to categories
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

-- Allow public read access to published blog posts
CREATE POLICY "Public read published blog_posts" ON blog_posts FOR SELECT USING (published = true);