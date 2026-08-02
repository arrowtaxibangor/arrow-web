'use client';

import { Content, Footer, Header } from 'antd/es/layout/layout';
import { ConfigProvider } from 'antd';
import { usePathname } from 'next/navigation';
import { HeaderComponent } from '@/components/Shared/Header/HeaderComponent';
import { FooterComponent } from '@/components/Shared/Footer/FooterComponent';
import { Banner } from '@/components/Shared/Banner/Banner';
import { MobileCtaBar } from '@/components/Shared/MobileCtaBar/MobileCtaBar';
import { BookingSidebarCard } from '@/components/Shared/BookingSidebarCard/BookingSidebarCard';
import QueryProvider from '../../../../utils/queryProvider';

export function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  const isFullBleed = pathname === '/' || pathname?.startsWith('/blog');

  return (
    <div className="w-full max-w-[1440px] mx-auto">
      <QueryProvider>
        <ConfigProvider theme={{ token: { fontFamily: 'Roboto' } }}>
          <Header className="w-full fixed top-0 right-0 h-[88px] tabletlg:h-[97.14px] z-50 bg-[#fff] !p-0">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full max-w-[1440px] mx-auto h-full tabletlg:px-[15px] px-[40px]">
                <HeaderComponent />
              </div>
            </div>
          </Header>
          <Content className="mt-[64px] sm:mt-[70px]">
            <Banner />
            <div className="relative px-16 mobile:px-6 pb-8">
              {isFullBleed ? (
                children
              ) : (
                <div className="flex gap-8 items-start tabletlg:block">
                  <div className="w-[65%] tabletlg:w-full">{children}</div>
                  <div className="w-[35%] tabletlg:hidden">
                    <BookingSidebarCard />
                  </div>
                </div>
              )}
            </div>
          </Content>
          <Footer className="w-full bg-[#fff] h-auto !p-0 mt-10 mobilelg:mt-6">
            <FooterComponent />
          </Footer>
          <MobileCtaBar />
        </ConfigProvider>
      </QueryProvider>
    </div>
  );
}
