import { notFound } from 'next/navigation';
import { getBlogPostWithWriter, listWriterProfiles } from '@/lib/supabase/blog';
import { BlogPostForm } from '@/components/admin/blog/BlogPostForm';

export default async function EditBlogPostPage({ params }: { params: { slug: string } }) {
  const [post, writers] = await Promise.all([
    getBlogPostWithWriter(params.slug),
    listWriterProfiles(),
  ]);
  if (!post) notFound();
  return <BlogPostForm post={post} writers={writers} />;
}
