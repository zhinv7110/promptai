-- Migration: Add Japanese (ja) and Korean (ko) columns for multilingual support

-- prompts: localized descriptions
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS description_ja TEXT;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS description_ko TEXT;

-- categories: localized names
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_ja TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_ko TEXT;

-- blog_posts: localized title, content, excerpt
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS title_ja TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS title_ko TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_ja TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_ko TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt_ja TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt_ko TEXT;

-- collections: user collections
ALTER TABLE collections ADD COLUMN IF NOT EXISTS name_ja TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS name_ko TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS description_ja TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS description_ko TEXT;

-- tags: localized names
ALTER TABLE tags ADD COLUMN IF NOT EXISTS name_ja TEXT;
ALTER TABLE tags ADD COLUMN IF NOT EXISTS name_ko TEXT;
