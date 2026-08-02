import { notFound } from 'next/navigation';
import { getPageById, getButtonVariants } from '@/lib/supabase/cms';
import { PageEditForm } from '@/components/admin/pages/PageEditForm';

export default async function EditPagePage({ params }: { params: { id: string } }) {
  const [page, buttonVariants] = await Promise.all([getPageById(params.id), getButtonVariants()]);
  if (!page) notFound();
  return <PageEditForm page={page} buttonVariants={buttonVariants} />;
}
