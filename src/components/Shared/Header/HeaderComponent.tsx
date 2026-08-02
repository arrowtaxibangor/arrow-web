/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button, Drawer, Menu, Image, MenuProps } from 'antd';
import React, { useEffect, useState, useMemo } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePagesLink } from '../../../../Hooks/PageLinksFetcher';
import { NavItems } from '../../../../utils/NavItems';
import { PHONE_DISPLAY, PHONE_HREF } from '../../../../utils/contact';

export const HeaderComponent = () => {
  const { data, isLoading } = usePagesLink();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  useEffect(() => {
    // Close the drawer when pathname changes
    setIsDrawerOpen(false);
  }, [pathname]);

  // Combine static NavItems with dynamic pages
  const menuItems: MenuProps['items'] = useMemo(() => {
    const dynamicPages =
      (!isLoading && data?.pages?.filter((page: any) => page.isPublished && page.isInHeader)) || [];

    const combinedItems = [
      ...NavItems.map((item) => ({
        key: item.key,
        label: (
          <Link href={item.href} className="!text-[16px] !font-[400] !text-[#414F58]">
            {item.label}
          </Link>
        ),
        href: item.href, // optional, for easier matching
      })),
      ...dynamicPages.map((page: any) => ({
        key: `dynamic-${page.id}`,
        label: (
          <Link href={`/${page.slug}`} className="!text-[16px] !font-[400] !text-[#414F58]">
            {page.title}
          </Link>
        ),
        href: `/${page.slug}`,
      })),
    ];

    return combinedItems;
  }, [data, isLoading]);

  // Compute selected key for active menu
  const selectedKey = useMemo<string>(() => {
    const clean = (s: string = '') => (s === '/' ? '/' : s.replace(/\/+$/, ''));
    const path = clean(pathname);

    const match = menuItems.find((item: any) => clean(item.href) === path);

    return String(match?.key ?? '');
  }, [pathname, menuItems]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full headerParent flex justify-between items-center">
        <Link
          href={'/'}
          className="w-fit h-full flex items-center"
          aria-label="Arrow Taxi Bangor — home"
        >
          <Image
            src={'/Assets/Images/logo.svg'}
            alt="Arrow Taxi Bangor"
            preview={false}
            className="!w-[143px] !h-[46.48px]"
          />
        </Link>

        {/* overflow-hidden / max-w-full removed: they clipped the element Ant
            measures for its overflow calculation. The items also genuinely did
            not fit (~1021px of links in ~965px), so .navMenu .ant-menu-item in
            globals.css tightens the per-item padding to bring them under. */}
        <div className="hidden sm:flex flex-1 justify-center">
          <Menu
            mode="horizontal"
            className="!border-none navMenu w-full flex justify-center"
            overflowedIndicator="..."
            items={menuItems}
            selectedKeys={[selectedKey]}
          />
        </div>

        <Link
          href={PHONE_HREF}
          aria-label={`Call Arrow Taxi on ${PHONE_DISPLAY}`}
          className="text-primary_color w-fit text-[36px] whitespace-nowrap font-[600] hidden sm:flex items-center gap-x-[10px]"
        >
          <Image src={'/Assets/Icons/phone.svg'} alt="" preview={false} height={30} width={30} />
          {PHONE_DISPLAY}
        </Link>

        <div className="sm:hidden flex items-center gap-x-1 headerChild headerChildRight">
          <Link
            href={PHONE_HREF}
            aria-label={`Call Arrow Taxi on ${PHONE_DISPLAY}`}
            className="text-primary_color text-[26px] mobile:text-[24px] font-[700] whitespace-nowrap flex items-center min-h-[44px] px-1"
          >
            {PHONE_DISPLAY}
          </Link>
          <Button
            className="text-primary_color hover:!text-primary_color flex items-center justify-center hover:!bg-white !min-w-[44px] !min-h-[44px]"
            icon={<MenuOutlined />}
            onClick={toggleDrawer}
            type="text"
            aria-label="Open navigation menu"
          />
        </div>
      </div>

      <Drawer
        title="Menu"
        placement="right"
        onClose={toggleDrawer}
        open={isDrawerOpen}
        className="sm:hidden"
      >
        <Menu
          mode="vertical"
          defaultSelectedKeys={['1']}
          items={menuItems}
          className="bg-transparent !text-primary_color flex flex-col"
        />
      </Drawer>
    </div>
  );
};
