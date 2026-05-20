export type Locale = 'en' | 'zh';

export interface Prompt {
  id: string;
  title_en: string;
  title_zh: string;
  slug: string;
  description_en: string | null;
  description_zh: string | null;
  category: string;
  tags: string[];
  prompt_text: string;
  model: string;
  example_image_url: string | null;
  is_premium: boolean;
  likes_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_zh: string;
  slug: string;
  icon: string | null;
}

export interface BlogPost {
  slug: string;
  title_en: string;
  title_zh: string;
  excerpt_en: string;
  excerpt_zh: string;
  content_en?: string;
  content_zh?: string;
  date: string;
  tags: string[];
  featured_image: string | null;
}
