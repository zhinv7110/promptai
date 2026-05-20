'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Replace with your actual IDs before production launch
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || '';

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Page view tracking
  useEffect(() => {
    if (!GA_ID && !CLARITY_ID) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');

    // Google Analytics
    if (GA_ID && typeof window !== 'undefined') {
      const w = window as unknown as Record<string, unknown>;
      if (w.gtag) {
        (w.gtag as Function)('config', GA_ID, { page_path: url });
      }
    }
  }, [pathname, searchParams]);

  if (!GA_ID && !CLARITY_ID) return null;

  return (
    <>
      {/* Google Analytics */}
      {GA_ID && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
            }}
          />
        </>
      )}
      {/* Microsoft Clarity */}
      {CLARITY_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`,
          }}
        />
      )}
    </>
  );
}
