import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/layout/AdminShell';

export const metadata: Metadata = { title: 'Arrow Taxi CMS' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="admin-root min-h-screen"
      style={{ fontFamily: 'var(--font-roboto), Arial, sans-serif' }}
    >
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
