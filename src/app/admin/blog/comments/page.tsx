'use client';
import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { CommentsActions } from '@/components/admin/blog/CommentsActions';
import { Badge } from '@/components/ui/badge';
import type { AdminComment } from '@/lib/supabase/blog';

type Filter = 'pending' | 'approved' | 'all';

export default function CommentsPage() {
  const [filter, setFilter] = useState<Filter>('pending');
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (f: Filter) => {
    setLoading(true);
    const res = await fetch(`/api/admin/comments?filter=${f}`);
    const data = await res.json();
    setComments(data.comments ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  function handleUpdate(id: string, approved: boolean | null) {
    if (approved === null) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    } else {
      if (filter === 'pending' && approved) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      } else if (filter === 'approved' && !approved) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      } else {
        setComments((prev) => prev.map((c) => (c.id === id ? { ...c, approved } : c)));
      }
    }
  }

  const tabs: { label: string; value: Filter }[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'All', value: 'all' },
  ];

  return (
    <div className="px-6 py-6">
      <PageHeader title="Comment Moderation" className="px-0 pt-0 mb-6" />

      <div className="flex gap-1 mb-4 border-b border-[hsl(var(--border))]">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === t.value
                ? 'border-[#265EA6] text-[#265EA6]'
                : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[hsl(var(--muted))] animate-pulse rounded-lg" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-[hsl(var(--muted-foreground))] py-10 text-center">
          {filter === 'pending' ? 'No pending comments — all clear.' : 'No comments found.'}
        </p>
      ) : (
        <div className="border border-[hsl(var(--border))] rounded-lg overflow-hidden">
          {comments.map((comment, i) => (
            <div
              key={comment.id}
              className={`px-4 py-4 flex flex-col sm:flex-row sm:items-start gap-3 ${
                i > 0 ? 'border-t border-[hsl(var(--border))]' : ''
              }`}
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{comment.author_name}</span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {comment.author_email}
                  </span>
                  <Badge variant={comment.approved ? 'default' : 'secondary'} className="text-xs">
                    {comment.approved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  On: <span className="font-medium text-foreground">{comment.post_title}</span>
                  {' · '}
                  {new Date(comment.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-sm mt-1 line-clamp-3">{comment.content}</p>
              </div>
              <CommentsActions comment={comment} onUpdate={handleUpdate} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
