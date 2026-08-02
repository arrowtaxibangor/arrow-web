import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDraft } from '@/lib/preview-drafts';
import type { BlogDraftContent } from '@/lib/preview-drafts';
import { PreviewBanner } from '@/components/admin/ui/PreviewBanner';
import { Avatar } from '@/components/blog/Avatar';
import { CategoryPill } from '@/components/blog/CategoryPill';
import { PostCover } from '@/components/blog/PostCover';
import { BookRideMiniCard } from '@/components/blog/BookRideMiniCard';
import { PHONE_DISPLAY, PHONE_HREF } from '../../../../../utils/contact';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string }; searchParams: { token?: string } };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function PreviewBlogPost({ params, searchParams }: Props) {
  const token = searchParams.token;
  if (!token) notFound();

  const draft = await getDraft(token);
  if (!draft || draft.type !== 'blog') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <p className="text-xl font-semibold text-gray-800">Preview expired</p>
        <p className="text-gray-500 text-sm">
          This preview link has expired or is invalid. Go back to the CMS editor and click Preview
          again.
        </p>
      </div>
    );
  }

  const post = (draft.content as BlogDraftContent).fields;
  const editorHref = params.slug === '__new__' ? '/admin/blog/new' : `/admin/blog/${params.slug}`;

  return (
    <>
      <PreviewBanner editorHref={editorHref} label={`Preview: ${post.title}`} />

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
            {post.h1 || post.title}
          </h1>

          <div className="flex items-center gap-3.5">
            <Avatar name={post.author} size="lg" />
            <div>
              <p className="text-[14px] font-semibold text-gray-900">{post.author}</p>
              <p className="text-[13px] text-gray-400">
                {formatDate(new Date().toISOString())}
                {post.reading_time_minutes && <> · ⏱ {post.reading_time_minutes} min read</>}
              </p>
            </div>
          </div>
        </div>
      </section>

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
            </div>

            <aside
              className="minTabletlg:sticky flex flex-col gap-4"
              style={{ top: 88, alignSelf: 'start' }}
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <Avatar name={post.author} size="xl" />
                  <div>
                    <p className="font-semibold text-[15px] text-gray-900">{post.author}</p>
                    {post.author_role && (
                      <p className="text-[12px] text-gray-400">{post.author_role}</p>
                    )}
                  </div>
                </div>
              </div>
              <BookRideMiniCard />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
