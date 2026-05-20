import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import PopularTools from '@/components/home/PopularTools';
import PromptCategories from '@/components/home/PromptCategories';
import LatestArticles from '@/components/home/LatestArticles';
import PopularPrompts from '@/components/home/PopularPrompts';
import { JsonLd } from '@/components/seo/JsonLd';
import { websiteSchema, canonicalUrl, alternateUrls } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'zh' ? 'AI 图像提示词工具与资源库' : 'AI Image Prompt Tools & Library';
  const description = locale === 'zh'
    ? '免费的 AI 图像提示词工具和资源库。为 Midjourney、Stable Diffusion、DALL-E 生成、增强和发现完美提示词。'
    : 'Free AI image prompt tools and library. Generate, enhance, and discover prompts for Midjourney, Stable Diffusion, and DALL-E.';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl(locale),
      languages: alternateUrls(),
    },
    openGraph: {
      title: `PromptAI - ${title}`,
      description,
      url: canonicalUrl(locale),
      siteName: 'PromptAI',
      images: [{ url: 'https://promptai.tools/og-image.png', width: 1200, height: 630 }],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `PromptAI - ${title}`,
      description,
      images: ['https://promptai.tools/og-image.png'],
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
