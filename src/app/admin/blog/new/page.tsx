import { listWriterProfiles } from '@/lib/supabase/blog';
import { BlogPostForm } from '@/components/admin/blog/BlogPostForm';

export default async function NewBlogPostPage() {
  const writers = await listWriterProfiles();
  return <BlogPostForm writers={writers} />;
}
