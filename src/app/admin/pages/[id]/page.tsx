import { notFound } from 'next/navigation';
import { getPageById } from '@/lib/supabase/cms';
import { PageEditForm } from '@/components/admin/pages/PageEditForm';

export default async function EditPagePage({ params }: { params: { id: string } }) {
  const page = await getPageById(params.id);
  if (!page) notFound();
  return <PageEditForm page={page} />;
}
