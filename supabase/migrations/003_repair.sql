-- Repair: add missing columns to existing prompts table
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS description_zh TEXT;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS model TEXT DEFAULT 'midjourney';
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS example_image_url TEXT;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Create categories if not exists
CREATE TABLE IF NOT EXISTS categories (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name_en TEXT NOT NULL, name_zh TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, icon TEXT);

-- Create blog_posts if not exists
CREATE TABLE IF NOT EXISTS blog_posts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title_en TEXT NOT NULL, title_zh TEXT NOT NULL, slug TEXT NOT NULL, content_en TEXT, content_zh TEXT, excerpt_en TEXT, excerpt_zh TEXT, featured_image TEXT, tags TEXT[] DEFAULT '{}', published BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now());

-- Seed categories
INSERT INTO categories (name_en, name_zh, slug, icon) VALUES ('Portrait', '人像', 'portrait', 'User'), ('Landscape', '风景', 'landscape', 'Landscape'), ('Fantasy', '奇幻', 'fantasy', 'Sword'), ('Anime', '动漫', 'anime', 'Drama'), ('Architecture', '建筑', 'architecture', 'Building'), ('Abstract', '抽象', 'abstract', 'Shapes'), ('Photorealistic', '写实', 'photorealistic', 'Camera'), ('Concept Art', '概念艺术', 'concept-art', 'PenLine') ON CONFLICT DO NOTHING;

-- Seed prompts
INSERT INTO prompts (title_en, title_zh, slug, description_en, description_zh, category, prompt_text, model, likes_count, views_count) VALUES
('Cinematic Portrait at Golden Hour', '黄金时刻电影质感人像', 'cinematic-portrait-golden-hour', 'Warm sunset lighting with professional composition.', '温暖的日落光线，专业构图。', 'portrait', 'cinematic portrait photography, golden hour lighting, warm sunset tones, professional model, shallow depth of field, bokeh background, 85mm lens, sharp focus on eyes, natural skin texture, 8K, editorial style', 'midjourney', 342, 2800),
('Cyberpunk Night City Street', '赛博朋克夜晚城市街道', 'cyberpunk-night-city', 'Neon-lit futuristic cityscape with rain-slicked streets.', '霓虹灯照亮的未来城市景观。', 'landscape', 'cyberpunk city street at night, neon lights reflection on wet pavement, rain, steam rising from vents, holographic billboards, futuristic architecture, cinematic composition, Blade Runner aesthetic, ultra wide angle, 8K, octane render', 'midjourney', 287, 2100),
('Fantasy Forest with Glowing Mushrooms', '带有发光蘑菇的奇幻森林', 'fantasy-forest-glowing-mushrooms', 'Magical forest scene with bioluminescent flora.', '充满生物发光植物的魔法森林场景。', 'fantasy', 'enchanted fantasy forest, giant glowing mushrooms, bioluminescent plants, magical atmosphere, fireflies, ancient trees, moss covered ground, ethereal lighting, volumetric fog, ray tracing, unreal engine 5, 8K, breathtaking', 'midjourney', 521, 4300),
('Anime Style Girl in Cherry Blossom', '樱花下的动漫风格女孩', 'anime-girl-cherry-blossom', 'Studio Ghibli inspired anime character in spring setting.', '吉卜力风格动画角色，春日樱花场景。', 'anime', 'anime style, studio ghibli inspired, beautiful young girl under cherry blossom tree, pink petals falling, spring atmosphere, soft lighting, detailed hair, flowing dress, hand-painted background, cel shaded, 2D animation aesthetic', 'midjourney', 456, 3800),
('Modern Minimalist Architecture Interior', '现代极简建筑室内', 'minimalist-architecture-interior', 'Clean lines, natural light in modern interior design.', '现代室内设计中的简洁线条和自然光线。', 'architecture', 'minimalist modern interior architecture, clean geometric lines, natural daylight through floor-to-ceiling windows, concrete and wood materials, elegant furniture, warm neutral tones, architectural photography, 8K, sharp details, wide angle lens', 'dalle3', 198, 1600),
('Abstract Fluid Art Swirling Colors', '抽象流体艺术旋转色彩', 'abstract-fluid-art-colors', 'Vibrant abstract fluid art with swirling colors.', '充满活力的抽象流体艺术。', 'abstract', 'abstract fluid art, swirling vibrant colors, marble texture, organic flowing patterns, metallic gold accents, high contrast, macro photography, liquid motion frozen in time, gallery quality, 8K', 'stable-diffusion', 167, 1400),
('Product Photography Luxury Watch', '产品摄影奢华手表', 'product-photography-luxury-watch', 'Professional product shot of a luxury timepiece.', '奢华手表的专业产品摄影。', 'photorealistic', 'professional product photography, luxury mechanical watch, dramatic studio lighting, macro details, watch movement visible, dark elegant background, reflections on polished metal, 100mm macro lens, commercial photography, 8K, ultra sharp', 'midjourney', 234, 1900),
('Concept Art Spaceship Interior Corridor', '概念艺术太空船内部走廊', 'concept-art-spaceship-corridor', 'Sci-fi concept art of a futuristic spaceship interior.', '科幻概念艺术，未来太空船内部。', 'concept-art', 'concept art, sci-fi spaceship interior corridor, futuristic technology, holographic displays, metallic surfaces, ambient blue lighting, industrial design details, atmospheric perspective, game art, artstation, 8K', 'midjourney', 312, 2600)
ON CONFLICT DO NOTHING;

-- Seed blog posts
INSERT INTO blog_posts (title_en, title_zh, slug, content_en, content_zh, excerpt_en, excerpt_zh, tags, published) VALUES
('Getting Started with AI Image Prompts', 'AI图像提示词入门指南', 'getting-started-midjourney', '<h2>Why Prompts Matter</h2><p>AI image generators need direction. A well-crafted prompt is the difference between mediocre and masterpiece.</p>', '<h2>为什么提示词很重要</h2><p>精心制作的提示词是平庸结果与杰作之间的区别。</p>', 'Everything you need to know about crafting effective prompts.', '制作有效提示词所需的一切。', ARRAY['beginner','tutorial','midjourney'], true),
('Mastering Stable Diffusion Prompts', 'Stable Diffusion 提示词进阶', 'mastering-stable-diffusion-prompts', '<h2>Beyond Basics</h2><p>Use prompt weighting: <code>(eyes:1.3)</code>. Higher weights increase importance.</p>', '<h2>超越基础</h2><p>使用权重：<code>(眼睛:1.3)</code>。</p>', 'Advanced prompting techniques for Stable Diffusion.', 'Stable Diffusion 高级提示词技巧。', ARRAY['stable-diffusion','advanced'], true),
('The Ultimate AI Art Style Guide', 'AI艺术风格完全指南', 'ai-art-style-guide', '<h2>Painting Styles</h2><p>Oil: <code>oil painting, impasto</code>. Watercolor: <code>soft wash, flowing colors</code>.</p>', '<h2>绘画风格</h2><p>油画: <code>油画, 厚涂</code>。水彩: <code>柔和渲染</code>。</p>', 'A comprehensive reference guide to AI art styles.', 'AI艺术风格完全参考指南。', ARRAY['guide','art-style'], true)
ON CONFLICT DO NOTHING;
