'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, BookOpen, Settings, LogOut, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/homepage', label: 'Homepage', icon: Home },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-white/20">
        <Link href="/admin" className="text-white font-bold text-lg leading-tight">
          Arrow Taxi
          <br />
          <span className="text-[#FEC601] text-sm font-normal">CMS Dashboard</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors min-h-[44px]',
                isActive
                  ? 'bg-white/20 text-white border-l-2 border-[#FEC601]'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors w-full min-h-[44px]"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
