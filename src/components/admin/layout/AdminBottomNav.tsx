'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, BookOpen, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="flex bg-[#265EA6] border-t border-white/20 safe-area-inset-bottom">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center py-2 gap-0.5 min-h-[56px] text-xs font-medium transition-colors',
              isActive ? 'text-[#FEC601]' : 'text-white/70 hover:text-white'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
