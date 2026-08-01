/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Col, Row, Image } from 'antd';
import Link from 'next/link';
import NextImage from 'next/image';
import { SOCIAL_ICON_META } from '../../../../utils/socialMediaIcons';
import { NavItems } from '../../../../utils/NavItems';
import { usePagesLink } from '../../../../Hooks/PageLinksFetcher';
import { useSocialIcons } from '../../../../Hooks/useSocialIcons';
import {
  ADDRESS_LINE,
  EMAIL,
  EMAIL_HREF,
  OPENING_HOURS,
  PHONE_DISPLAY,
  PHONE_HREF,
} from '../../../../utils/contact';
import { BookingButton } from '../BookingButton/BookingButton';

// 44px min height keeps every footer link a valid touch target on phones.
const linkClass =
  'flex items-center min-h-[44px] hover:underline font-[400] text-[16px] leading-[22px]';

export const FooterComponent = () => {
  const { data, isLoading } = usePagesLink();
  const socialIcons = useSocialIcons();

  // One link list only. Previously a hardcoded column and a dynamic CMS column
  // rendered overlapping sets (Airport Transfers, Caernarfon, Snowdonia and
  // Contact all appeared twice) and a third row repeated Home/Contact again.
  const staticHrefs = new Set(NavItems.map((item) => item.href));
  const extraPages: any[] =
    (!isLoading &&
      data?.pages
        ?.filter((page: any) => page.isPublished)
        ?.filter((page: any) => !staticHrefs.has(`/${page.slug}`))) ||
    [];

  return (
    <footer className="w-full flex flex-col !gap-0">
      <div className="relative w-full h-[102px] translate-y-[2px]">
        <NextImage
          src="/Assets/Images/FooterWave.svg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Row className="bg-primary_color text-white p-[72px] tabletlg:p-[40px] mobile:p-[24px] h-full gap-y-[30px]">
        {/* Brand + booking CTA */}
        <Col className="flex flex-col gap-[20px]" xxl={10} xl={10} lg={10} md={24} sm={24} xs={24}>
          <Image
            src="/Assets/Images/logoFooter.svg"
            alt="Arrow Taxi Bangor"
            preview={false}
            width={200}
            height={66}
          />
          <p className="leading-[28px] text-[14px] font-[400] max-w-[340px]">
            Book a taxi online or give us a call on {PHONE_DISPLAY}. We offer cheap airport runs,
            Snowdonia taxi services, tours, and photo tours.
          </p>
          <div className="w-full max-w-[280px]">
            <BookingButton />
          </div>
          <div className="flex gap-[8px] items-center flex-wrap">
            {socialIcons.map((item, index) => {
              const meta = SOCIAL_ICON_META[item.icon];
              if (!meta) return null;
              return (
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={`${item.icon}-${index}`}
                  aria-label={`Arrow Taxi on ${meta.label}`}
                  className="flex items-center justify-center w-[44px] h-[44px] rounded-full transition-colors hover:bg-white/10"
                >
                  <Image src={meta.src} width={24} height={24} alt="" preview={false} />
                </Link>
              );
            })}
          </div>
        </Col>

        {/* Pages */}
        <Col className="flex flex-col" xxl={7} xl={7} lg={7} md={24} sm={24} xs={24}>
          <h2 className="text-[16px] font-[600] pb-[6px]">Pages</h2>
          {NavItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </Link>
          ))}
          {extraPages.map((page: any) => (
            <Link key={page.id} href={`/${page.slug}`} className={linkClass}>
              {page.title}
            </Link>
          ))}
        </Col>

        {/* Contact */}
        <Col className="flex flex-col" xxl={7} xl={7} lg={7} md={24} sm={24} xs={24}>
          <h2 className="text-[16px] font-[600] pb-[6px]">Contact</h2>
          <Link
            href={PHONE_HREF}
            aria-label={`Call Arrow Taxi on ${PHONE_DISPLAY}`}
            className={linkClass}
          >
            {PHONE_DISPLAY}
          </Link>
          <a href={EMAIL_HREF} className={linkClass}>
            {EMAIL}
          </a>
          <p className="text-[16px] leading-[22px] font-[400] pt-[10px]">{ADDRESS_LINE}</p>
          <p className="text-[16px] leading-[22px] font-[400] pt-[10px]">{OPENING_HOURS}</p>
        </Col>

        {/* Legal */}
        <Col
          xxl={24}
          xl={24}
          lg={24}
          md={24}
          sm={24}
          xs={24}
          className="border-t border-white/20 pt-[24px] mt-[10px]"
        >
          <p className="text-[14px] leading-[22px] font-[400]">
            Arrow Taxi Bangor Ltd. is a registered business in Wales, company number 17006952.
          </p>
        </Col>
      </Row>
    </footer>
  );
};
