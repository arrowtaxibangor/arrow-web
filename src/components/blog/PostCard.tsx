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

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-200 ease-out hover:-translate-y-[3px] hover:shadow-xl"
    >
      <PostCover imageUrl={post.cover_image_url} category={post.category} alt={post.title} />

      <div className="flex flex-col gap-3 p-6 flex-1">
        {post.category && <CategoryPill category={post.category} />}

        <h2 className="font-bold text-[18px] leading-snug tracking-tight text-gray-900 group-hover:text-primary_color transition-colors">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-[14px] text-gray-500 leading-relaxed line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Avatar name={post.author} size="sm" />
            <span className="text-[13px] font-medium text-gray-700">
              {post.author.split(' ')[0]}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-[12px] text-gray-400">{formatDate(post.created_at)}</span>
          </div>
          {post.reading_time_minutes && (
            <span className="font-mono text-[10px] text-gray-400">
              ⏱ {post.reading_time_minutes} min
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
