'use client';
import './globals.css';
import QueryProvider from '../../utils/queryProvider';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { HeaderComponent } from '@/components/Shared/Header/HeaderComponent';
import { FooterComponent } from '@/components/Shared/Footer/FooterComponent';
import { ConfigProvider, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Banner } from '@/components/Shared/Banner/Banner';
import { MobileCtaBar } from '@/components/Shared/MobileCtaBar/MobileCtaBar';
import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isCSSLoaded, setIsCSSLoaded] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;
    const checkStylesLoaded = () => {
      if (document.styleSheets.length > 0) {
        setIsCSSLoaded(true);
      } else {
        setTimeout(checkStylesLoaded, 100);
      }
    };
    checkStylesLoaded();
  }, [pathname]);

  if (pathname?.startsWith('/admin')) {
    return (
      <html lang="en">
        <body className="antialiased">{children}</body>
      </html>
    );
  }
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-R7TJ7GZ231"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-R7TJ7GZ231');
                  `}
        </Script>

        {/* Google Tag Manager Script */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-T3Z3MFW5');
                `}
        </Script>
        <div className="w-full max-w-[1440px] mx-auto">
          <QueryProvider>
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: 'Roboto',
                },
              }}
            >
              {isCSSLoaded ? (
                <>
                  <Header className="w-full fixed top-0 right-0 h-[88px] tabletlg:h-[97.14px] z-50 bg-[#fff] !p-0">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-full max-w-[1440px] mx-auto h-full tabletlg:px-[15px] px-[40px]">
                        <HeaderComponent />
                      </div>
                    </div>
                  </Header>
                  <Content className="mt-[64px] sm:mt-[70px]">
                    <Banner />
                    <div className="relative px-16 mobile:px-6 pb-8">{children}</div>
                  </Content>
                  <Footer className="w-full bg-[#fff] h-auto !p-0 mt-10 mobilelg:mt-6">
                    <FooterComponent />
                  </Footer>
                  <MobileCtaBar />
                </>
              ) : (
                <div className="h-screen w-full flex items-center justify-center">
                  <Spin />
                </div>
              )}
            </ConfigProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
