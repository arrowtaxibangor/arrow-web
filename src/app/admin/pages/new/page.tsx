import Link from 'next/link';
import { countPages, MAX_MAIN_PAGES, getButtonVariants } from '@/lib/supabase/cms';
import { PageEditForm } from '@/components/admin/pages/PageEditForm';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function NewPagePage() {
  const [existing, buttonVariants] = await Promise.all([countPages(), getButtonVariants()]);
  const atCap = existing >= MAX_MAIN_PAGES;

  if (atCap) {
    return (
      <div className="px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
            <Link href="/admin/pages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <PageHeader title="New Page" className="px-0 pt-0 mb-0" />
        </div>
        <div className="max-w-xl border border-amber-200 bg-amber-50 rounded-md px-4 py-3">
          <p className="text-sm text-amber-800">
            Maximum of {MAX_MAIN_PAGES} main pages reached, delete or archive an existing page to
            add a new one.
          </p>
          <div className="mt-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/pages">Back to pages</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <PageEditForm buttonVariants={buttonVariants} />;
}
