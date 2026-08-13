import './globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Roboto } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { RootShell } from '@/components/Shared/RootShell/RootShell';
import { GtagPageview } from '@/components/Shared/Analytics/GtagPageview';
import { Suspense } from 'react';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.arrow.taxi'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="antialiased">
        {/* Google tag (gtag.js) — "Arrow Taxi Homepage" tag in Google Tag
            Manager. Fans out to GA4 (G-R7TJ7GZ231) and Google Ads
            (AW-953912986) automatically via its configured destinations.
            `send_page_view: false` disables the built-in auto-pageview so
            <GtagPageview/> can fire one manual page_view per route change
            (auto-tracking misses App Router SPA transitions). */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GT-KD2VRCS7"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GT-KD2VRCS7', { send_page_view: false });
          `}
        </Script>
        <Suspense fallback={null}>
          <GtagPageview />
        </Suspense>
        <AntdRegistry>
          <RootShell>{children}</RootShell>
        </AntdRegistry>
      </body>
    </html>
  );
}
