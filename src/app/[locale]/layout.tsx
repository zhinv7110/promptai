import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Analytics } from '@/components/seo/Analytics';
import { use } from 'react';

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  if (!routing.locales.includes(locale as 'en' | 'zh')) notFound();
  return <LocaleLayoutInner locale={locale}>{children}</LocaleLayoutInner>;
}

async function LocaleLayoutInner({ children, locale }: { children: React.ReactNode; locale: string }) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
          </div>
        </AuthProvider>
      </ThemeProvider>
      <Analytics />
    </NextIntlClientProvider>
  );
}
