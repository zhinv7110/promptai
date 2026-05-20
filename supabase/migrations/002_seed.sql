-- Tags table (normalized)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL UNIQUE,
  name_zh TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- Junction: prompt <-> tag
CREATE TABLE prompt_tags (
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, tag_id)
);

-- Indexes
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_prompt_tags_prompt ON prompt_tags(prompt_id);
CREATE INDEX idx_prompt_tags_tag ON prompt_tags(tag_id);

-- Seed: tags
INSERT INTO tags (name_en, name_zh, slug) VALUES
  ('Portrait', '人像', 'portrait'),
  ('Landscape', '风景', 'landscape'),
  ('Fantasy', '奇幻', 'fantasy'),
  ('Anime', '动漫', 'anime'),
  ('Architecture', '建筑', 'architecture'),
  ('Abstract', '抽象', 'abstract'),
  ('Photorealistic', '写实', 'photorealistic'),
  ('Concept Art', '概念艺术', 'concept-art'),
  ('Cinematic', '电影感', 'cinematic'),
  ('Cyberpunk', '赛博朋克', 'cyberpunk'),
  ('Magical', '魔法', 'magical'),
  ('Ghibli', '吉卜力', 'ghibli'),
  ('Minimal', '极简', 'minimal'),
  ('Product', '产品', 'product'),
  ('Luxury', '奢华', 'luxury'),
  ('Sci-Fi', '科幻', 'sci-fi'),
  ('Interior', '室内', 'interior'),
  ('Colorful', '多彩', 'colorful'),
  ('Art', '艺术', 'art');

-- Seed: prompts (8 curated prompts)
INSERT INTO prompts (title_en, title_zh, slug, description_en, description_zh, category, prompt_text, model, likes_count, views_count) VALUES
  (
    'Cinematic Portrait at Golden Hour',
    '黄金时刻电影质感人像',
    'cinematic-portrait-golden-hour',
    'Warm sunset lighting with professional composition for stunning portrait photography.',
    '温暖的日落光线，专业构图，拍摄令人惊艳的人像摄影。',
    'portrait',
    'cinematic portrait photography, golden hour lighting, warm sunset tones, professional model, shallow depth of field, bokeh background, 85mm lens, sharp focus on eyes, natural skin texture, 8K, editorial style',
    'midjourney',
    342, 2800
  ),
  (
    'Cyberpunk Night City Street',
    '赛博朋克夜晚城市街道',
    'cyberpunk-night-city',
    'Neon-lit futuristic cityscape with rain-slicked streets and holographic advertisements.',
    '霓虹灯照亮的未来城市景观，雨水打湿的街道和全息广告。',
    'landscape',
    'cyberpunk city street at night, neon lights reflection on wet pavement, rain, steam rising from vents, holographic billboards, futuristic architecture, cinematic composition, Blade Runner aesthetic, ultra wide angle, 8K, octane render',
    'midjourney',
    287, 2100
  ),
  (
    'Fantasy Forest with Glowing Mushrooms',
    '带有发光蘑菇的奇幻森林',
    'fantasy-forest-glowing-mushrooms',
    'Magical forest scene with bioluminescent flora and mystical atmosphere.',
    '充满生物发光植物和神秘氛围的魔法森林场景。',
    'fantasy',
    'enchanted fantasy forest, giant glowing mushrooms, bioluminescent plants, magical atmosphere, fireflies, ancient trees, moss covered ground, ethereal lighting, volumetric fog, ray tracing, unreal engine 5, 8K, breathtaking',
    'midjourney',
    521, 4300
  ),
  (
    'Anime Style Girl in Cherry Blossom',
    '樱花下的动漫风格女孩',
    'anime-girl-cherry-blossom',
    'Studio Ghibli inspired anime character in a spring cherry blossom setting.',
    '吉卜力风格动画角色，春日樱花场景。',
    'anime',
    'anime style, studio ghibli inspired, beautiful young girl under cherry blossom tree, pink petals falling, spring atmosphere, soft lighting, detailed hair, flowing dress, hand-painted background, cel shaded, 2D animation aesthetic',
    'midjourney',
    456, 3800
  ),
  (
    'Modern Minimalist Architecture Interior',
    '现代极简建筑室内',
    'minimalist-architecture-interior',
    'Clean lines, natural light, and elegant simplicity in modern interior design.',
    '现代室内设计中的简洁线条、自然光线和优雅简约。',
    'architecture',
    'minimalist modern interior architecture, clean geometric lines, natural daylight through floor-to-ceiling windows, concrete and wood materials, elegant furniture, warm neutral tones, architectural photography, 8K, sharp details, wide angle lens',
    'dalle3',
    198, 1600
  ),
  (
    'Abstract Fluid Art Swirling Colors',
    '抽象流体艺术旋转色彩',
    'abstract-fluid-art-colors',
    'Vibrant abstract fluid art with swirling colors and organic patterns.',
    '充满活力的抽象流体艺术，旋转的色彩和有机图案。',
    'abstract',
    'abstract fluid art, swirling vibrant colors, marble texture, organic flowing patterns, metallic gold accents, high contrast, macro photography, liquid motion frozen in time, gallery quality, 8K',
    'stable-diffusion',
    167, 1400
  ),
  (
    'Product Photography Luxury Watch',
    '产品摄影奢华手表',
    'product-photography-luxury-watch',
    'Professional product shot of a luxury timepiece with dramatic lighting.',
    '奢华手表的专业产品摄影，戏剧性灯光。',
    'photorealistic',
    'professional product photography, luxury mechanical watch, dramatic studio lighting, macro details, watch movement visible, dark elegant background, reflections on polished metal, 100mm macro lens, commercial photography, 8K, ultra sharp',
    'midjourney',
    234, 1900
  ),
  (
    'Concept Art Spaceship Interior Corridor',
    '概念艺术太空船内部走廊',
    'concept-art-spaceship-corridor',
    'Sci-fi concept art of a futuristic spaceship interior with advanced technology.',
    '科幻概念艺术，未来太空船内部，展现先进科技。',
    'concept-art',
    'concept art, sci-fi spaceship interior corridor, futuristic technology, holographic displays, metallic surfaces, ambient blue lighting, industrial design details, atmospheric perspective, game art, artstation, 8K',
    'midjourney',
    312, 2600
  );

-- Seed: blog posts
INSERT INTO blog_posts (title_en, title_zh, slug, content_en, content_zh, excerpt_en, excerpt_zh, tags, published) VALUES
  (
    'Getting Started with AI Image Prompts',
    'AI图像提示词入门指南',
    'getting-started-midjourney',
    '<h2>Why Prompts Matter</h2><p>AI image generators like Midjourney, Stable Diffusion, and DALL-E are powerful tools, but they need direction. A well-crafted prompt is the difference between a mediocre result and a masterpiece.</p><h2>Basic Prompt Structure</h2><p>A good prompt typically includes: Subject, Style, Lighting, Composition, and Quality. The more specific and descriptive you are, the better the AI understands what you want.</p><p><strong>Example:</strong> Instead of "a cat sitting on a windowsill", try "A fluffy orange tabby cat sleeping peacefully on a sunlit wooden windowsill, golden hour light streaming through lace curtains, shallow depth of field, 85mm lens, cozy cottage atmosphere, photorealistic, 8K".</p><h2>Common Mistakes</h2><p>1. Too vague — "a beautiful landscape" tells the AI nothing<br>2. Too complicated — don''t cram 50 adjectives into one prompt<br>3. Ignoring negative prompts — tell the AI what NOT to include</p>',
    '<h2>为什么提示词很重要</h2><p>Midjourney、Stable Diffusion 和 DALL-E 等 AI 图像生成器是强大的工具，但它们需要指引。精心制作的提示词是平庸结果与杰作之间的区别。</p><h2>基本提示词结构</h2><p>一个好的提示词通常包括：主题、风格、光线、构图和质量。你越具体、描述性越强，AI就越能理解你的需求。</p><p><strong>示例：</strong> 不要写"一只坐在窗台上的猫"，试试"一只蓬松的橘色虎斑猫在阳光洒落的木制窗台上安睡，金色时刻的光线透过蕾丝窗帘洒入，浅景深，85mm镜头，舒适小屋氛围，写实风格，8K"。</p><h2>常见错误</h2><p>1. 过于模糊 — "美丽的风景"对AI来说毫无意义<br>2. 过于复杂 — 不要把50个形容词塞进一句话<br>3. 忽略反向提示词 — 告诉AI你不想要什么</p>',
    'New to AI image generation? This guide covers everything you need to know about crafting effective prompts.',
    '刚接触AI图像生成？本指南涵盖制作有效提示词所需的一切。',
    ARRAY['beginner', 'tutorial', 'midjourney'],
    true
  ),
  (
    'Mastering Stable Diffusion Prompts',
    'Stable Diffusion 提示词进阶',
    'mastering-stable-diffusion-prompts',
    '<h2>Beyond Basic Prompts</h2><p>Stable Diffusion gives you incredible control over image generation. Once you''ve mastered the basics, these advanced techniques will help you create exactly what you envision.</p><h2>Prompt Weighting</h2><p>Use parentheses to emphasize words: <code>(beautiful detailed eyes:1.3)</code>. Higher weights (>1.0) increase importance, lower weights (<1.0) reduce it.</p><h2>The Power of Negative Prompts</h2><p>A strong negative prompt is crucial. Template: <code>ugly, deformed, blurry, low quality, watermark, text, bad anatomy, extra limbs, poorly drawn face, disfigured, jpeg artifacts</code></p><h2>Token Efficiency</h2><p>SD has a soft token limit of ~75 tokens. Every word counts. Prioritize: Subject > Style > Lighting > Quality > Composition.</p>',
    '<h2>超越基础提示词</h2><p>Stable Diffusion 让你对图像生成拥有惊人的控制力。掌握基础之后，这些高级技巧将帮助你精确实现你想要的画面。</p><h2>提示词权重</h2><p>使用括号强调词汇：<code>(美丽精致的眼睛:1.3)</code>。权重大于1.0增强重要性，小于1.0降低。</p><h2>反向提示词的力量</h2><p>一个强大的反向提示词至关重要。模板：<code>丑陋的, 变形的, 模糊的, 低质量的, 水印, 文字, 糟糕的人体结构, 多余的肢体, 画得不好的脸部, 毁容的, JPEG伪影</code></p><h2>Token 效率</h2><p>SD 有约75个 token 的软限制。优先级：主题 > 风格 > 光线 > 质量 > 构图。</p>',
    'Take your Stable Diffusion prompts to the next level with advanced prompting techniques, weighting, and style mixing.',
    '通过高级提示词技巧、权重调整和风格混合，将你的Stable Diffusion提示词提升到新水平。',
    ARRAY['stable-diffusion', 'advanced', 'technique'],
    true
  ),
  (
    'The Ultimate AI Art Style Guide',
    'AI艺术风格完全指南',
    'ai-art-style-guide',
    '<h2>Painting Styles</h2><h3>Oil Painting</h3><p><code>oil painting, impasto texture, visible brushstrokes, classical art, rich pigments</code> — Best for portraits, landscapes, historical scenes.</p><h3>Watercolor</h3><p><code>watercolor, soft wash, flowing colors, paper texture, delicate</code> — Best for botanical illustrations, dreamy landscapes, fashion.</p><h2>Digital Art Styles</h2><h3>Concept Art</h3><p><code>concept art, artstation, digital painting, professional</code> — Best for character design, environment art.</p><h3>3D Render</h3><p><code>3D render, octane, unreal engine 5, ray tracing, CGI</code> — Best for product visualization, architectural renders.</p><h2>Photography Styles</h2><h3>Cinematic</h3><p><code>cinematic, anamorphic lens, film grain, 35mm, color graded</code></p><h3>Portrait</h3><p><code>portrait photography, 85mm, shallow depth of field, bokeh</code></p><h2>Culturally Distinct</h2><p>Japanese Ukiyo-e: <code>ukiyo-e, Japanese woodblock, Hokusai style</code><br>Chinese Ink Wash: <code>ink wash, sumi-e, traditional Chinese painting</code></p>',
    '<h2>绘画风格</h2><h3>油画</h3><p><code>油画, 厚涂肌理, 可见笔触, 古典艺术, 浓郁颜料</code> — 最适合肖像、风景、历史场景。</p><h3>水彩</h3><p><code>水彩, 柔和渲染, 流动色彩, 纸张纹理, 精致</code> — 最适合植物插图、梦幻风景、时尚。</p><h2>数字艺术风格</h2><h3>概念艺术</h3><p><code>概念艺术, artstation, 数字绘画, 专业</code> — 最适合角色设计、环境艺术。</p><h3>3D渲染</h3><p><code>3D渲染, octane, 虚幻引擎5, 光线追踪, CGI</code> — 最适合产品可视化、建筑渲染。</p><h2>摄影风格</h2><h3>电影感</h3><p><code>电影感, 变形镜头, 胶片颗粒, 35mm, 调色</code></p><h3>人像摄影</h3><p><code>人像摄影, 85mm, 浅景深, 背景虚化</code></p><h2>各文化独特风格</h2><p>日本浮世绘: <code>浮世绘, 日本木版画, 葛饰北斋风格</code><br>中国水墨: <code>水墨, 中国画, 传统绘画, 极简</code></p>',
    'A comprehensive reference guide to AI art styles — from classic painting techniques to modern digital aesthetics.',
    '一份全面的AI艺术风格参考指南——从经典绘画技法到现代数字美学。',
    ARRAY['guide', 'art-style', 'reference'],
    true
  );
