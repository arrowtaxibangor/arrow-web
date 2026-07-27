import Link from 'next/link';
import type { BlogPost } from '@/lib/supabase/blog';
import { Avatar } from './Avatar';
import { CategoryPill } from './CategoryPill';
import { PostCover } from './PostCover';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <div className="rounded-3xl bg-white border border-gray-200 overflow-hidden grid grid-cols-1 minTabletlg:grid-cols-[1fr_44%] transition-shadow hover:shadow-2xl">
      <div className="flex flex-col justify-between p-10 tablet:p-8 gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] bg-gray-900 text-white px-[8px] py-[4px] rounded">
              Featured
            </span>
            {post.category && <CategoryPill category={post.category} />}
          </div>

          <h2
            className="font-extrabold text-gray-900 leading-[1.15] tracking-tight"
            style={{ fontSize: 'clamp(24px, 3vw, 34px)' }}
          >
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-[16px] text-gray-500 leading-[1.7]">{post.excerpt}</p>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={post.author} size="md" />
            <div>
              <p className="text-[14px] font-semibold text-gray-900">{post.author}</p>
              <p className="text-[12px] text-gray-400">
                {formatDate(post.created_at)}
                {post.reading_time_minutes && ` · ${post.reading_time_minutes} min read`}
              </p>
            </div>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 text-[14px] font-medium text-gray-700 hover:border-primary_color hover:text-primary_color transition-colors"
          >
            Read article →
          </Link>
        </div>
      </div>

      <div className="hidden minTabletlg:block">
        <PostCover
          imageUrl={post.cover_image_url}
          category={post.category}
          alt={post.title}
          minHeight={320}
        />
      </div>
    </div>
  );
}
