import './globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Roboto } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { RootShell } from '@/components/Shared/RootShell/RootShell';

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
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-T3Z3MFW5');
          `}
        </Script>
        <AntdRegistry>
          <RootShell>{children}</RootShell>
        </AntdRegistry>
      </body>
    </html>
  );
}
