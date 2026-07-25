import Link from 'next/link';
import type { BlogPost } from '@/lib/supabase/blog';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow bg-white"
    >
      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_image_url} alt={post.title} className="w-full h-48 object-cover" />
      )}
      <div className="flex flex-col gap-3 p-5 flex-1">
        {post.category && (
          <span className="text-xs font-semibold uppercase tracking-wide text-[#265EA6]">
            {post.category}
          </span>
        )}
        <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#265EA6] transition-colors leading-snug">
          {post.title}
        </h2>
        {post.excerpt && <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>}
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span>{post.author}</span>
          <span className="flex items-center gap-3">
            {post.reading_time_minutes && <span>{post.reading_time_minutes} min read</span>}
            <span>{formatDate(post.created_at)}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
