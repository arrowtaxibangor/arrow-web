import Link from 'next/link';
import { listAllPages, MAX_MAIN_PAGES } from '@/lib/supabase/cms';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PagesTableActions } from '@/components/admin/pages/PagesTableActions';

export default async function PagesListPage() {
  const pages = await listAllPages();
  const atCap = pages.length >= MAX_MAIN_PAGES;

  return (
    <div className="px-6 py-6">
      <PageHeader
        title="Pages"
        description={`CMS pages served dynamically from Supabase (${pages.length}/${MAX_MAIN_PAGES})`}
        className="px-0 pt-0 mb-6"
        action={
          atCap ? (
            <Button
              disabled
              className="bg-[#265EA6] text-white opacity-50 cursor-not-allowed"
              title={`Maximum of ${MAX_MAIN_PAGES} main pages reached, delete or archive an existing page to add a new one`}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Page
            </Button>
          ) : (
            <Button asChild className="bg-[#265EA6] hover:bg-[#1e4e8c] text-white">
              <Link href="/admin/pages/new">
                <Plus className="h-4 w-4 mr-1" />
                New Page
              </Link>
            </Button>
          )
        }
      />
      {atCap && (
        <p className="mb-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          Maximum of {MAX_MAIN_PAGES} main pages reached, delete or archive an existing page to add
          a new one.
        </p>
      )}

      <div className="border border-[hsl(var(--border))] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Slug</th>
              <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Sections</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr
                key={page.id}
                className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/40"
              >
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="hover:text-[#265EA6] hover:underline"
                  >
                    {page.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))] hidden sm:table-cell font-mono text-xs">
                  /{page.slug}
                </td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))] hidden md:table-cell">
                  {page.sections?.length ?? 0}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge published={page.is_published} />
                </td>
                <td className="px-4 py-3">
                  <PagesTableActions page={page} />
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-[hsl(var(--muted-foreground))]"
                >
                  No pages yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
