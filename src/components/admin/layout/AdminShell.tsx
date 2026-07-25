'use client';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminBottomNav } from './AdminBottomNav';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-[hsl(var(--background))]">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col bg-[#265EA6] z-40">
        <AdminSidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-60 pb-20 md:pb-0">{children}</main>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <AdminBottomNav />
      </div>
    </div>
  );
}
