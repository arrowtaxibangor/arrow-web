import { notFound } from 'next/navigation';
import { getBlogPostWithWriter } from '@/lib/supabase/blog';
import { BlogPostForm } from '@/components/admin/blog/BlogPostForm';

export default async function EditBlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostWithWriter(params.slug);
  if (!post) notFound();
  return <BlogPostForm post={post} />;
}
