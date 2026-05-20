-- Drop existing policies
DROP POLICY IF EXISTS "Public read prompts" ON prompts;

-- Allow full public access (read + write) since this is a public content site
CREATE POLICY "Public access prompts" ON prompts FOR ALL USING (true) WITH CHECK (true);

-- Same for categories and blog_posts
DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public access categories" ON categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read published blog_posts" ON blog_posts;
CREATE POLICY "Public access blog_posts" ON blog_posts FOR ALL USING (true) WITH CHECK (true);
