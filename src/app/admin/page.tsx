import Link from 'next/link';
import { getDashboardStats } from '@/lib/supabase/blog';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatsCard } from '@/components/admin/ui/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileEdit, Clock, AlertCircle } from 'lucide-react';

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="px-6 py-6 space-y-6">
      <PageHeader
        title="Dashboard"
        description="Content overview for Arrow Taxi"
        className="px-0 pt-0 mb-0"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Published Posts"
          value={stats.totalPublishedPosts}
          icon={<BookOpen className="h-5 w-5" />}
          href="/admin/blog"
        />
        <StatsCard
          title="Drafts"
          value={stats.totalDraftPosts}
          description={stats.totalDraftPosts > 0 ? 'Unpublished work sitting idle' : undefined}
          icon={<FileEdit className="h-5 w-5" />}
          href="/admin/blog"
        />
        <StatsCard
          title="Days Since Last Post"
          value={stats.daysSinceLastPublishedPost ?? '—'}
          description={
            stats.daysSinceLastPublishedPost === null
              ? 'No posts published yet'
              : stats.daysSinceLastPublishedPost > 7
                ? 'Content velocity is slowing'
                : 'Publishing regularly'
          }
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            SEO Gaps
            {stats.pagesWithoutMetaDescription.length > 0 && (
              <AlertCircle className="h-4 w-4 text-amber-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.pagesWithoutMetaDescription.length === 0 ? (
            <p className="text-sm text-green-600 font-medium">All pages have meta descriptions.</p>
          ) : (
            <div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
                Pages missing meta description:
              </p>
              {stats.pagesWithoutMetaDescription.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between py-2 border-b border-[hsl(var(--border))] last:border-0"
                >
                  <span className="text-sm font-medium">{page.title}</span>
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="text-[#265EA6] text-xs hover:underline shrink-0"
                  >
                    Fix →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Top Posts — All-Time Views</CardTitle>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            All-time totals. Older posts have a structural advantage.
          </p>
        </CardHeader>
        <CardContent>
          {stats.topPostsByViews.length === 0 ? (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">No published posts yet.</p>
          ) : (
            <div>
              {stats.topPostsByViews.map((post, i) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 py-2.5 border-b border-[hsl(var(--border))] last:border-0"
                >
                  <span className="text-xs font-bold text-[hsl(var(--muted-foreground))] w-5 shrink-0">
                    #{i + 1}
                  </span>
                  <Link
                    href={`/admin/blog/${post.slug}`}
                    className="flex-1 text-sm font-medium hover:text-[#265EA6] hover:underline truncate"
                  >
                    {post.title}
                  </Link>
                  <span className="text-sm text-[hsl(var(--muted-foreground))] shrink-0">
                    {post.views.toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
