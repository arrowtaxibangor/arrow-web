import type { Metadata } from 'next';
import { listBlogPosts } from '@/lib/supabase/blog';
import type { BlogCategory } from '@/lib/supabase/blog';
import { PostCard } from '@/components/blog/PostCard';
import { CategoryTabs } from '@/components/blog/CategoryTabs';
import { FeaturedPostCard } from '@/components/blog/FeaturedPostCard';
import { NewsletterBand } from '@/components/blog/NewsletterBand';

export const revalidate = 60;

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

  const featuredPost = !category ? posts.find((p) => p.featured) : undefined;
  const gridPosts = featuredPost ? posts.filter((p) => p.id !== featuredPost.id) : posts;

  return (
    <>
      {/* Page header band */}
      <section
        className="w-full"
        style={{
          background: 'linear-gradient(180deg, #f0f5fb 0%, #e8f0fa 100%)',
          paddingTop: 48,
          paddingBottom: 36,
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gray-400 mb-3">
            Arrow Taxi Blog
          </p>
          <h1
            className="font-extrabold text-gray-900 leading-[1.08] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
          >
            Local guides, tips & taxi news.
          </h1>
          <p className="mt-3 text-[16px] text-gray-500 leading-[1.6]">
            From Snowdonia hikes to airport transfer advice — written by the Arrow Taxi team.
          </p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-6 pt-10 pb-12">
        <CategoryTabs active={active} />

        {featuredPost && (
          <div className="mb-12">
            <FeaturedPostCard post={featuredPost} />
          </div>
        )}

        {gridPosts.length === 0 ? (
          <p className="mt-12 text-center text-[16px] text-gray-400">
            {category
              ? `No posts in ${category} yet — check back soon.`
              : 'No posts yet — check back soon.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      <NewsletterBand />
    </>
  );
}
