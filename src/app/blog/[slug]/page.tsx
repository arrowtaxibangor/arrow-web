import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPostWithWriter, listBlogPosts, listComments } from '@/lib/supabase/blog';
import { ViewTracker } from '@/components/blog/ViewTracker';
import { CommentForm } from '@/components/blog/CommentForm';
import { PostCard } from '@/components/blog/PostCard';
import { Avatar } from '@/components/blog/Avatar';
import { CategoryPill } from '@/components/blog/CategoryPill';
import { PostCover } from '@/components/blog/PostCover';
import { NewsletterMiniCard } from '@/components/blog/NewsletterMiniCard';
import { PHONE_DISPLAY, PHONE_HREF } from '../../../../utils/contact';

export const revalidate = 60;
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

      {/* Article header */}
      <section
        className="w-full"
        style={{
          background: 'linear-gradient(180deg, #f0f5fb 0%, #e8f0fa 100%)',
          paddingTop: 48,
          paddingBottom: 20,
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <nav className="flex items-center gap-2 mb-4 text-[13px] text-gray-400">
            <Link href="/blog" className="hover:text-gray-700 transition-colors">
              Blog
            </Link>
            <span className="text-[12px]">›</span>
            {post.category && <CategoryPill category={post.category} />}
          </nav>

          <h1
            className="font-extrabold text-gray-900 leading-[1.1] tracking-[-0.025em] mb-7"
            style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', maxWidth: 840 }}
          >
            {post.title}
          </h1>

          <div className="flex items-center gap-3.5">
            <Avatar name={post.author} size="lg" />
            <div>
              <p className="text-[14px] font-semibold text-gray-900">{post.author}</p>
              <p className="text-[13px] text-gray-400">
                {formatDate(post.created_at)}
                {post.reading_time_minutes && <> · ⏱ {post.reading_time_minutes} min read</>}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cover image strip */}
      <div className="max-w-[1280px] mx-auto px-6 mt-4">
        <div className="overflow-hidden" style={{ borderRadius: 24, minHeight: 380 }}>
          <PostCover
            imageUrl={post.cover_image_url}
            category={post.category}
            alt={post.title}
            minHeight={380}
          />
        </div>
      </div>

      {/* Article body */}
      <section className="w-full" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 minTabletlg:grid-cols-[1fr_292px] gap-[72px]">
            <div>
              {post.excerpt && (
                <p className="text-[19px] text-gray-500 leading-[1.8] pb-12 mb-12 border-b border-gray-200">
                  {post.excerpt}
                </p>
              )}

              <div
                className="article-prose"
                dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
              />

              {/* CTA */}
              <div
                className="mt-12 p-10 rounded-3xl border border-gray-200"
                style={{ background: 'linear-gradient(180deg, #f0f5fb 0%, #ffffff 100%)' }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gray-400 mb-3">
                  Ready to book?
                </p>
                <h3 className="font-bold text-[22px] text-gray-900 mb-3">
                  Arrow Taxi — Bangor&apos;s trusted taxi service
                </h3>
                <p className="text-[15px] text-gray-500 leading-[1.65] mb-6">
                  Available 24/7 for airport transfers, Snowdonia trips and local rides across
                  Gwynedd.
                </p>
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary_color text-white text-[14px] font-semibold rounded-full hover:bg-[#1e4e8c] transition-colors"
                >
                  Call {PHONE_DISPLAY} →
                </a>
              </div>

              {/* Comments */}
              <section className="mt-16 pt-12 border-t border-gray-200">
                <h2 className="text-[22px] font-bold text-gray-900 mb-8">
                  Comments {comments.length > 0 && `(${comments.length})`}
                </h2>

                {comments.length > 0 && (
                  <div className="flex flex-col gap-6 mb-10">
                    {comments.map((c) => (
                      <div key={c.id} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-gray-900">
                            {c.author_name}
                          </span>
                          <span className="text-xs text-gray-400">{formatDate(c.created_at)}</span>
                        </div>
                        <p className="text-sm text-gray-700">{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <h3 className="text-[16px] font-semibold text-gray-900 mb-4">Leave a comment</h3>
                <CommentForm slug={post.slug} />
              </section>
            </div>

            {/* Sidebar */}
            <aside
              className="minTabletlg:sticky flex flex-col gap-4"
              style={{ top: 88, alignSelf: 'start' }}
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <Avatar name={post.author} size="xl" />
                  <div>
                    <p className="font-semibold text-[15px] text-gray-900">{post.author}</p>
                    {(post.author_role ?? post.writer_profiles?.role) && (
                      <p className="text-[12px] text-gray-400">
                        {post.author_role ?? post.writer_profiles?.role}
                      </p>
                    )}
                  </div>
                </div>
                {post.writer_profiles?.bio && (
                  <p className="text-[13px] text-gray-500 mt-3 leading-relaxed">
                    {post.writer_profiles.bio}
                  </p>
                )}
              </div>

              <NewsletterMiniCard />
            </aside>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section
          className="w-full py-20"
          style={{ background: 'linear-gradient(180deg, #f0f5fb 0%, #ffffff 100%)' }}
        >
          <div className="max-w-[1280px] mx-auto px-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gray-400 mb-3">
              Continue reading
            </p>
            <h2
              className="font-bold text-gray-900 leading-tight tracking-tight mb-10"
              style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}
            >
              More from the Arrow Taxi blog
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
