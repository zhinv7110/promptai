import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { JsonLd } from '@/components/seo/JsonLd';
import { websiteSchema, alternateUrls } from '@/lib/metadata';
import { Analytics } from '@vercel/analytics/react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const BASE_URL = 'https://thaumary.ai';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Thaumary AI - AI Image Prompt Tools & Library',
    template: '%s | Thaumary AI',
  },
  description: 'Free AI image prompt tools and library for Midjourney, Stable Diffusion, and DALL-E.',
  keywords: ['AI prompts', 'image generation', 'Midjourney', 'Stable Diffusion', 'DALL-E', 'prompt generator', 'AI art'],
  authors: [{ name: 'Thaumary AI' }],
  creator: 'Thaumary AI',
  publisher: 'Thaumary AI',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Thaumary AI',
    title: 'Thaumary AI - AI Image Prompt Tools & Library',
    description: 'Free AI image prompt tools and library for Midjourney, Stable Diffusion, and DALL-E.',
    url: BASE_URL,
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thaumary AI - AI Image Prompt Tools & Library',
    description: 'Free AI image prompt tools and library.',
    images: [`${BASE_URL}/og-image.png`],
  },
  alternates: {
    languages: alternateUrls(),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd data={websiteSchema()} />
      </head>
      <body className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
