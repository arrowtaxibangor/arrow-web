/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Col, Row, Image } from 'antd';
import Link from 'next/link';
import NextImage from 'next/image';
import { socialMediaIcons } from '../../../../utils/socialMediaIcons';
import { usePagesLink } from '../../../../Hooks/PageLinksFetcher';

export const FooterComponent = () => {
  const { data, isLoading } = usePagesLink();

  const dynamicPages = data?.pages?.filter((page: any) => page.isPublished) || [];

  return (
    <footer className="w-full flex flex-col !gap-0">
      <div className="relative w-full h-[102px] translate-y-[2px]">
        <NextImage
          src="/Assets/Images/FooterWave.svg"
          alt="Footer Wave"
          fill
          className="object-cover"
        />
      </div>

      <Row className="bg-primary_color text-white p-[72px] tabletlg:p-[40px] h-full space-y-[30px] mobile:space-y-[20px]">
        {/* Left Column: Logo, Description, Social Icons */}
        <Col className="flex flex-col gap-[24px]" xxl={10} xl={10} lg={10} md={24} sm={24} xs={24}>
          <Image
            src="/Assets/Images/logoFooter.svg"
            alt="logo"
            preview={false}
            width={200}
            height={66}
          />
          <p className="leading-[28px] text-[14px] font-[400]">
            Book a taxi online or give us a call <br /> on 01248209393. We offer cheap airport runs,
            <br /> Snowdonia taxi services, tours, and photo tours.
          </p>
          <div className="flex gap-[35px] items-center flex-wrap">
            {socialMediaIcons?.map((item) => (
              <Link href={item?.href} target="_blank" key={item?.href}>
                <Image src={item?.icon} width={30} height={30} alt="icon" preview={false} />
              </Link>
            ))}
          </div>
        </Col>

        {/* Middle Columns: Static Menus */}
        <Col
          className="flex flex-col gap-[40px] mobile:gap-[20px]"
          xxl={4}
          xl={4}
          lg={4}
          md={24}
          sm={24}
          xs={24}
        >
          <Link href="/" className="block hover:underline font-[400] text-[16px] leading-[22px]">
            Home
          </Link>
          <Link
            href="/contact"
            className="block hover:underline font-[400] text-[16px] leading-[22px]"
          >
            Contact
          </Link>
          <Link
            href="/caernarfon-taxi"
            className="block hover:underline font-[400] text-[16px] leading-[22px]"
          >
            Caernarfon Taxi
          </Link>
          <Link
            href="/snowdon-taxi"
            className="block hover:underline font-[400] text-[16px] leading-[22px]"
          >
            Snowdonia Taxi
          </Link>
          <Link
            href="/airport-transfers"
            className="block hover:underline font-[400] text-[16px] leading-[22px]"
          >
            Airport Transfers
          </Link>
        </Col>

        <Col
          className="flex flex-col gap-[40px] mobile:gap-[20px]"
          xxl={6}
          xl={6}
          lg={6}
          md={24}
          sm={24}
          xs={24}
        >
          {/* Dynamic Pages from API */}
          {!isLoading &&
            dynamicPages.map((page: any) => (
              <Link
                key={page.id}
                href={`/${page.slug}`}
                className="block hover:underline font-[400] text-[16px] leading-[22px]"
              >
                {page.title}
              </Link>
            ))}
        </Col>

        {/* Right Column: Contact Info */}
        <Col
          className="flex flex-col gap-[10px] tabletlg:gap-[40px] mobile:gap-[15px]"
          xxl={4}
          xl={4}
          lg={4}
          md={24}
          sm={24}
          xs={24}
        >
          <span className="font-[400] text-[16px] leading-[22px]">Call us</span>
          <Link
            href="tel:+441248209393"
            className="block text-white hover:underline font-[400] text-[16px] leading-[22px]"
          >
            01248209393
          </Link>
        </Col>

        {/* Bottom Row: Repeated Links & Company Info */}
        <Col
          className="flex justify-between items-center tabletlg:flex-col tabletlg:gap-[40px]"
          xxl={24}
          xl={24}
          lg={24}
          md={24}
          sm={24}
          xs={24}
        >
          <div className="flex w-full gap-[40px] flex-wrap">
            <Link href="/" className="block hover:underline font-[400] text-[16px] leading-[22px]">
              Home
            </Link>
            <Link
              href="/contact"
              className="block hover:underline font-[400] text-[16px] leading-[22px]"
            >
              Contact
            </Link>
            {/* {!isLoading &&
              dynamicPages.map((page: any) => (
                <Link
                  key={`bottom-${page.id}`}
                  href={`/${page.slug}`}
                  className="block hover:underline font-[400] text-[16px] leading-[22px]"
                >
                  {page.title}
                </Link>
              ))} */}
          </div>
          <div className="w-full text-start font-[400] text-[16px] tabletlg:max-w-full max-w-[300px] leading-[22px]">
            Arrow Taxi Bangor Ltd. is a registered business in Wales company number 17006952.
          </div>
        </Col>
      </Row>
      {/* Bottom Footer */}
      {/* <div className="mt-10 text-center text-xs text-white">
        © 2025, All Rights Reserved
      </div> */}
    </footer>
  );
};
