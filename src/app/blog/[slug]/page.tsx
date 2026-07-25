import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBlogPostWithWriter, listBlogPosts, listComments } from '@/lib/supabase/blog';
import { ViewTracker } from '@/components/blog/ViewTracker';
import { CommentForm } from '@/components/blog/CommentForm';
import { PostCard } from '@/components/blog/PostCard';

export const revalidate = false;
export const dynamicParams = true;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const posts = await listBlogPosts({ publishedOnly: true });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostWithWriter(params.slug);
  if (!post) return { title: 'Post Not Found — Arrow Taxi' };
  return {
    metadataBase: new URL('https://arrow.taxi'),
    title: post.meta_title ?? `${post.title} — Arrow Taxi Blog`,
    description: post.meta_description ?? post.excerpt ?? '',
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.meta_title ?? post.title,
      description: post.meta_description ?? post.excerpt ?? '',
      images: post.cover_image_url ? [post.cover_image_url] : [],
      type: 'article',
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BlogPostPage({ params }: Props) {
  const [post, allPosts] = await Promise.all([
    getBlogPostWithWriter(params.slug),
    listBlogPosts({ publishedOnly: true }),
  ]);

  if (!post || !post.published) notFound();

  const comments = await listComments(post.id, true);

  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? '',
    image: post.cover_image_url ?? undefined,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.created_at,
    dateModified: post.updated_at,
    url: `https://arrow.taxi/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker slug={post.slug} />

      <article className="w-full max-w-3xl mx-auto px-4 py-16 mobile:py-10">
        <header className="mb-10">
          {post.category && (
            <span className="text-sm font-semibold uppercase tracking-wide text-[#265EA6]">
              {post.category}
            </span>
          )}
          <h1 className="mt-2 text-4xl mobile:text-3xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span>
              By <strong className="text-gray-700">{post.author}</strong>
              {post.author_role && ` · ${post.author_role}`}
            </span>
            <span>{formatDate(post.created_at)}</span>
            {post.reading_time_minutes && <span>{post.reading_time_minutes} min read</span>}
          </div>
        </header>

        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full rounded-xl mb-10 object-cover max-h-[420px]"
          />
        )}

        <div
          className="prose prose-lg max-w-none [&>p]:my-3"
          dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
        />

        {post.writer_profiles && (
          <div className="mt-12 flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-200">
            {post.writer_profiles.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.writer_profiles.avatar_url}
                alt={post.writer_profiles.name}
                className="w-14 h-14 rounded-full object-cover shrink-0"
              />
            )}
            <div>
              <p className="font-semibold text-gray-900">{post.writer_profiles.name}</p>
              {post.writer_profiles.role && (
                <p className="text-sm text-gray-500">{post.writer_profiles.role}</p>
              )}
              {post.writer_profiles.bio && (
                <p className="mt-1 text-sm text-gray-600">{post.writer_profiles.bio}</p>
              )}
            </div>
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="w-full max-w-6xl mx-auto px-4 py-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      <section className="w-full max-w-3xl mx-auto px-4 py-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>

        {comments.length > 0 && (
          <div className="flex flex-col gap-6 mb-10">
            {comments.map((c) => (
              <div key={c.id} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900">{c.author_name}</span>
                  <span className="text-xs text-gray-400">{formatDate(c.created_at)}</span>
                </div>
                <p className="text-sm text-gray-700">{c.content}</p>
              </div>
            ))}
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Comment</h3>
        <CommentForm slug={post.slug} />
      </section>
    </>
  );
}
