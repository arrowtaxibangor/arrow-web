import type { Metadata } from 'next';
import { listBlogPosts } from '@/lib/supabase/blog';
import type { BlogCategory } from '@/lib/supabase/blog';
import { PostCard } from '@/components/blog/PostCard';
import { CategoryTabs } from '@/components/blog/CategoryTabs';

export const revalidate = false;

export const metadata: Metadata = {
  title: 'Blog — Arrow Taxi Bangor',
  description:
    'Tips, guides and local knowledge from Arrow Taxi — airport transfers, Snowdonia tours and more.',
  alternates: { canonical: '/blog' },
};

type Props = { searchParams: { category?: string } };

const VALID_CATEGORIES: BlogCategory[] = [
  'Local Guide',
  'Airport Tips',
  'Snowdonia',
  'News',
  'Travel Tips',
];

export default async function BlogIndexPage({ searchParams }: Props) {
  const raw = searchParams.category;
  const category = VALID_CATEGORIES.includes(raw as BlogCategory)
    ? (raw as BlogCategory)
    : undefined;

  const posts = await listBlogPosts({ publishedOnly: true, category });
  const active = category ?? 'All';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 mobile:py-10">
      <h1 className="text-4xl mobile:text-3xl font-bold text-gray-900 mb-2">Blog</h1>
      <p className="text-gray-500 mb-8">Local guides, travel tips and taxi news from Bangor.</p>

      <CategoryTabs active={active} />

      {posts.length === 0 ? (
        <p className="mt-12 text-center text-gray-400">No posts yet — check back soon.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
