import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import PopularTools from '@/components/home/PopularTools';
import PromptCategories from '@/components/home/PromptCategories';
import LatestArticles from '@/components/home/LatestArticles';
import PopularPrompts from '@/components/home/PopularPrompts';
import { JsonLd } from '@/components/seo/JsonLd';
import { websiteSchema, canonicalUrl, alternateUrls } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

const HOME_META: Record<string, { title: string; description: string }> = {
  en: {
    title: 'AI Image Prompt Tools & Library',
    description: 'Free AI image prompt tools and library. Generate, enhance, and discover prompts for Midjourney, Stable Diffusion, and DALL-E.',
  },
  zh: {
    title: 'AI 图像提示词工具与资源库',
    description: '免费的 AI 图像提示词工具和资源库。为 Midjourney、Stable Diffusion、DALL-E 生成、增强和发现完美提示词。',
  },
  ja: {
    title: 'AI画像プロンプトツール＆ライブラリ',
    description: '無料のAI画像プロンプトツールとライブラリ。Midjourney、Stable Diffusion、DALL-E用のプロンプトを生成、強化、発見できます。',
  },
  ko: {
    title: 'AI 이미지 프롬프트 도구 및 라이브러리',
    description: '무료 AI 이미지 프롬프트 도구 및 라이브러리. Midjourney, Stable Diffusion, DALL-E를 위한 프롬프트를 생성, 향상, 발견하세요.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = HOME_META[locale as keyof typeof HOME_META] || HOME_META.en;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl(locale),
      languages: alternateUrls(),
    },
    openGraph: {
      title: `Thaumary - ${meta.title}`,
      description: meta.description,
      url: canonicalUrl(locale),
      siteName: 'Thaumary',
      images: [{ url: 'https://thaumary.ai/og-image.png', width: 1200, height: 630 }],
      locale: locale === 'zh' ? 'zh_CN' : locale === 'ja' ? 'ja_JP' : locale === 'ko' ? 'ko_KR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Thaumary - ${meta.title}`,
      description: meta.description,
      images: ['https://thaumary.ai/og-image.png'],
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <JsonLd data={websiteSchema()} />
      <Hero locale={locale} />
      <PopularTools locale={locale} />
      <PromptCategories />
      <LatestArticles locale={locale} />
      <PopularPrompts locale={locale} />
    </>
  );
}
