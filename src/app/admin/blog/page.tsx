import Link from 'next/link';
import { listBlogPosts } from '@/lib/supabase/blog';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BlogPostActions } from '@/components/admin/blog/BlogPostActions';

export default async function BlogListPage() {
  const posts = await listBlogPosts({ publishedOnly: false });

  return (
    <div className="px-6 py-6">
      <PageHeader
        title="Blog Posts"
        description="All posts including drafts"
        className="px-0 pt-0 mb-6"
        action={
          <Button asChild className="bg-[#265EA6] hover:bg-[#1e4e8c] text-white">
            <Link href="/admin/blog/new">
              <Plus className="h-4 w-4 mr-1" />
              New Post
            </Link>
          </Button>
        }
      />

      <div className="border border-[hsl(var(--border))] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Category</th>
              <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Views</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/40"
              >
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/admin/blog/${post.slug}`}
                    className="hover:text-[#265EA6] hover:underline"
                  >
                    {post.title}
                  </Link>
                  {post.featured && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))] hidden md:table-cell">
                  {post.category ?? '—'}
                </td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))] hidden sm:table-cell">
                  {post.views.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge published={post.published} />
                </td>
                <td className="px-4 py-3">
                  <BlogPostActions post={post} />
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-[hsl(var(--muted-foreground))]"
                >
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
