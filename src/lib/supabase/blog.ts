import { supabaseAdmin } from './client';

export type BlogCategory = 'Local Guide' | 'Airport Tips' | 'Snowdonia' | 'News' | 'Travel Tips';

export type WriterProfile = {
  id: string;
  name: string;
  role: string | null;
  email: string | null;
  bio: string | null;
  avatar_url: string | null;
  twitter_handle: string | null;
  linkedin_url: string | null;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  author: string;
  author_role: string | null;
  writer_profile_id: string | null;
  category: BlogCategory | null;
  tags: string[] | null;
  reading_time_minutes: number | null;
  published: boolean;
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  views: number;
  created_at: string;
  updated_at: string;
  writer_profiles?: WriterProfile | null;
};

export type BlogComment = {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  created_at: string;
};

export type BlogPostInput = Omit<
  BlogPost,
  'id' | 'views' | 'created_at' | 'updated_at' | 'writer_profiles'
>;
export type BlogCommentInput = Omit<BlogComment, 'id' | 'approved' | 'created_at'>;
export type WriterProfileInput = Omit<WriterProfile, 'id'>;

// ── Blog Posts ─────────────────────────────────────────────

export async function listBlogPosts(opts?: {
  publishedOnly?: boolean;
  featured?: boolean;
  category?: BlogCategory;
  limit?: number;
}): Promise<BlogPost[]> {
  let q = supabaseAdmin
    .from('blog_posts')
    .select('*, writer_profiles(*)')
    .order('created_at', { ascending: false });

  if (opts?.publishedOnly !== false) q = q.eq('published', true);
  if (opts?.featured !== undefined) q = q.eq('featured', opts.featured);
  if (opts?.category) q = q.eq('category', opts.category);
  if (opts?.limit) q = q.limit(opts.limit);

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getBlogPostWithWriter(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*, writer_profiles(*)')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const { data, error } = await supabaseAdmin.from('blog_posts').insert(input).select().single();

  if (error) throw error;
  return data;
}

export async function updateBlogPost(
  slug: string,
  input: Partial<BlogPostInput>
): Promise<BlogPost> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .update(input)
    .eq('slug', slug)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogPost(slug: string): Promise<void> {
  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('slug', slug);
  if (error) throw error;
}

export async function incrementBlogViews(slug: string): Promise<void> {
  // Uses a DB function to avoid race conditions on the views counter.
  // Create this in Supabase Studio:
  //   create or replace function increment_blog_views(post_slug text)
  //   returns void language sql as $$
  //     update blog_posts set views = views + 1 where slug = post_slug;
  //   $$;
  await supabaseAdmin.rpc('increment_blog_views', { post_slug: slug });
}

export async function getBlogStats(): Promise<{
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  pendingComments: number;
}> {
  const [postsRes, commentsRes] = await Promise.all([
    supabaseAdmin.from('blog_posts').select('published, views'),
    supabaseAdmin.from('blog_comments').select('id', { count: 'exact' }).eq('approved', false),
  ]);

  if (postsRes.error) throw postsRes.error;
  if (commentsRes.error) throw commentsRes.error;

  const posts = postsRes.data ?? [];
  return {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.published).length,
    totalViews: posts.reduce((sum, p) => sum + (p.views ?? 0), 0),
    pendingComments: commentsRes.count ?? 0,
  };
}

// ── Comments ───────────────────────────────────────────────

export async function listComments(postId: string, approvedOnly = true): Promise<BlogComment[]> {
  let q = supabaseAdmin
    .from('blog_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (approvedOnly) q = q.eq('approved', true);

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function createComment(input: BlogCommentInput): Promise<BlogComment> {
  const { data, error } = await supabaseAdmin.from('blog_comments').insert(input).select().single();

  if (error) throw error;
  return data;
}

export async function updateComment(
  id: string,
  input: Pick<BlogComment, 'approved'>
): Promise<BlogComment> {
  const { data, error } = await supabaseAdmin
    .from('blog_comments')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteComment(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('blog_comments').delete().eq('id', id);
  if (error) throw error;
}

// ── Writer Profiles ────────────────────────────────────────

export async function listWriterProfiles(): Promise<WriterProfile[]> {
  const { data, error } = await supabaseAdmin.from('writer_profiles').select('*').order('name');

  if (error) throw error;
  return data ?? [];
}

export async function createWriterProfile(input: WriterProfileInput): Promise<WriterProfile> {
  const { data, error } = await supabaseAdmin
    .from('writer_profiles')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateWriterProfile(
  id: string,
  input: Partial<WriterProfileInput>
): Promise<WriterProfile> {
  const { data, error } = await supabaseAdmin
    .from('writer_profiles')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteWriterProfile(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('writer_profiles').delete().eq('id', id);
  if (error) throw error;
}

export type AdminComment = BlogComment & { post_slug: string; post_title: string };

export async function listAllCommentsAdmin(filter?: {
  approved?: boolean;
}): Promise<AdminComment[]> {
  let q = supabaseAdmin
    .from('blog_comments')
    .select('*, blog_posts!post_id(id, title, slug)')
    .order('created_at', { ascending: false });

  if (filter?.approved !== undefined) {
    q = q.eq('approved', filter.approved);
  }

  const { data, error } = await q;
  if (error) throw error;

  return (data ?? []).map((c: Record<string, unknown>) => {
    const posts = c.blog_posts as { slug: string; title: string } | null;
    const { blog_posts: _bp, ...rest } = c;
    return {
      ...(rest as BlogComment),
      post_slug: posts?.slug ?? '',
      post_title: posts?.title ?? 'Unknown',
    };
  });
}

export interface DashboardStats {
  totalPublishedPosts: number;
  totalDraftPosts: number;
  pendingCommentsTotal: number;
  postsWithPendingComments: {
    post_id: string;
    post_title: string;
    post_slug: string;
    pending_count: number;
  }[];
  topPostsByViews: {
    id: string;
    title: string;
    slug: string;
    views: number;
    updated_at: string;
  }[];
  pagesWithoutMetaDescription: { id: string; title: string; slug: string }[];
  daysSinceLastPublishedPost: number | null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [postsRes, commentsRes, pagesRes] = await Promise.all([
    supabaseAdmin.from('blog_posts').select('id, title, slug, published, views, updated_at'),
    supabaseAdmin.from('blog_comments').select('id, post_id, approved').eq('approved', false),
    supabaseAdmin.from('cms_pages').select('id, title, slug, meta_description'),
  ]);

  const posts = postsRes.data ?? [];
  const pendingComments = commentsRes.data ?? [];
  const pages = pagesRes.data ?? [];

  const published = posts.filter((p) => p.published);
  const drafts = posts.filter((p) => !p.published);

  const topPostsByViews = [...published]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      views: p.views ?? 0,
      updated_at: p.updated_at,
    }));

  const pendingByPost: Record<string, number> = {};
  for (const c of pendingComments) {
    pendingByPost[c.post_id] = (pendingByPost[c.post_id] ?? 0) + 1;
  }
  const postMap = Object.fromEntries(posts.map((p) => [p.id, p]));
  const postsWithPendingComments = Object.entries(pendingByPost)
    .map(([post_id, pending_count]) => ({
      post_id,
      post_title: postMap[post_id]?.title ?? 'Unknown',
      post_slug: postMap[post_id]?.slug ?? '',
      pending_count,
    }))
    .sort((a, b) => b.pending_count - a.pending_count);

  const lastPublished = [...published].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )[0];
  const daysSinceLastPublishedPost = lastPublished
    ? Math.floor((Date.now() - new Date(lastPublished.updated_at).getTime()) / 86400000)
    : null;

  const pagesWithoutMetaDescription = pages
    .filter((p) => !p.meta_description)
    .map((p) => ({ id: p.id, title: p.title, slug: p.slug }));

  return {
    totalPublishedPosts: published.length,
    totalDraftPosts: drafts.length,
    pendingCommentsTotal: pendingComments.length,
    postsWithPendingComments,
    topPostsByViews,
    pagesWithoutMetaDescription,
    daysSinceLastPublishedPost,
  };
}
