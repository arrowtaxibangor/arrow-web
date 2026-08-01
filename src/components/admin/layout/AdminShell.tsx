'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the drawer whenever the route changes so a link inside doesn't
  // leave the overlay covering the new page.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-[hsl(var(--background))]">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col bg-[#265EA6] z-40">
        <AdminSidebar />
      </aside>

      {/* Mobile top bar with hamburger */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-[#265EA6] px-4 h-14">
        <div className="text-white font-bold text-base leading-tight">
          Arrow Taxi
          <span className="ml-2 text-[#FEC601] text-xs font-normal">CMS</span>
        </div>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
          className="text-white p-2 -mr-2 hover:bg-white/10 rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile slide-out drawer */}
      {drawerOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside
            role="dialog"
            aria-label="Admin navigation"
            className="md:hidden fixed left-0 top-0 h-screen w-64 max-w-[85vw] flex flex-col bg-[#265EA6] z-50 shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-2 top-2 text-white p-2 hover:bg-white/10 rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
            <AdminSidebar />
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0">{children}</main>
    </div>
  );
}
