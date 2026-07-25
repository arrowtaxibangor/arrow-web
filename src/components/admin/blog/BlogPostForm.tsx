'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { BlogPost, WriterProfile } from '@/lib/supabase/blog';
import { TiptapEditor } from '@/components/admin/sections/TiptapEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { SeoAssist } from '@/components/admin/ai/SeoAssist';
import { ImageField } from '@/components/admin/ui/ImageField';

const CATEGORIES = ['Local Guide', 'Airport Tips', 'Snowdonia', 'News', 'Travel Tips'] as const;

type FormFields = {
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  author: string;
  author_role: string;
  reading_time_minutes: number | '';
  meta_title: string;
  meta_description: string;
  published: boolean;
  featured: boolean;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function BlogPostForm({ post, writers }: { post?: BlogPost; writers: WriterProfile[] }) {
  const router = useRouter();
  const isNew = !post;

  const [content, setContent] = useState(post?.content ?? '');
  const [category, setCategory] = useState<string>(post?.category ?? '');
  const [writerId, setWriterId] = useState<string>(post?.writer_profile_id ?? '');
  const [tags, setTags] = useState(post?.tags?.join(', ') ?? '');
  const [slugManual, setSlugManual] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      excerpt: post?.excerpt ?? '',
      cover_image_url: post?.cover_image_url ?? '',
      author: post?.author ?? '',
      author_role: post?.author_role ?? '',
      reading_time_minutes: post?.reading_time_minutes ?? '',
      meta_title: post?.meta_title ?? '',
      meta_description: post?.meta_description ?? '',
      published: post?.published ?? false,
      featured: post?.featured ?? false,
    },
  });

  const title = watch('title');
  const metaDesc = watch('meta_description');

  useEffect(() => {
    if (!slugManual && title) setValue('slug', slugify(title));
  }, [title, slugManual, setValue]);

  useEffect(() => {
    if (writerId) {
      const w = writers.find((wr) => wr.id === writerId);
      if (w) {
        setValue('author', w.name);
        setValue('author_role', w.role ?? '');
      }
    }
  }, [writerId, writers, setValue]);

  const onSubmit = async (data: FormFields) => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const payload = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: content || null,
      cover_image_url: data.cover_image_url || null,
      author: data.author,
      author_role: data.author_role || null,
      writer_profile_id: writerId || null,
      category: category || null,
      tags: tags
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : null,
      reading_time_minutes:
        data.reading_time_minutes !== '' ? Number(data.reading_time_minutes) : null,
      published: data.published,
      featured: data.featured,
      meta_title: data.meta_title || null,
      meta_description: data.meta_description || null,
    };

    try {
      if (isNew) {
        const res = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to create post');
      } else {
        const res = await fetch(`/api/blog/${post!.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to update post');
      }

      await fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'blog', slug: data.slug }),
      });

      setSuccess(true);
      if (isNew) router.push('/admin/blog');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  async function handleDelete() {
    await fetch(`/api/blog/${post!.slug}`, { method: 'DELETE' });
    router.push('/admin/blog');
  }

  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={isNew ? 'New Post' : `Edit: ${post!.title}`}
          className="px-0 pt-0 mb-0"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title', { required: true })}
                className="mt-1 text-base font-medium"
                placeholder="Post title"
              />
              {errors.title && <p className="text-xs text-red-600 mt-1">Title is required</p>}
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                {...register('excerpt')}
                className="mt-1 resize-none"
                rows={2}
                placeholder="Short summary for listings"
              />
            </div>
            <div>
              <Label className="mb-1 block">Content</Label>
              <div className="border border-[hsl(var(--border))] rounded-md overflow-hidden">
                <TiptapEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Write your post…"
                />
              </div>
            </div>
          </div>

          <div className="lg:w-72 space-y-4 shrink-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published" className="cursor-pointer text-sm">
                    Published
                  </Label>
                  <Switch
                    id="published"
                    checked={watch('published')}
                    onCheckedChange={(v) => setValue('published', v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured" className="cursor-pointer text-sm">
                    Featured
                  </Label>
                  <Switch
                    id="featured"
                    checked={watch('featured')}
                    onCheckedChange={(v) => setValue('featured', v)}
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="text-xs">
                    Slug
                  </Label>
                  <div className="flex items-center mt-1 gap-1">
                    <span className="text-xs text-[hsl(var(--muted-foreground))] shrink-0">
                      /blog/
                    </span>
                    <Input
                      id="slug"
                      {...register('slug', { required: true })}
                      onFocus={() => setSlugManual(true)}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reading_time" className="text-xs">
                    Reading time (min)
                  </Label>
                  <Input
                    id="reading_time"
                    type="number"
                    min={1}
                    {...register('reading_time_minutes')}
                    className="mt-1 text-sm"
                    placeholder="5"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Categorisation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-1 text-sm">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tags" className="text-xs">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="mt-1 text-sm"
                    placeholder="comma, separated"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Author</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {writers.length > 0 && (
                  <div>
                    <Label className="text-xs">Writer profile</Label>
                    <Select value={writerId} onValueChange={setWriterId}>
                      <SelectTrigger className="mt-1 text-sm">
                        <SelectValue placeholder="Select writer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {writers.map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label htmlFor="author" className="text-xs">
                    Author name
                  </Label>
                  <Input
                    id="author"
                    {...register('author', { required: true })}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="author_role" className="text-xs">
                    Author role
                  </Label>
                  <Input
                    id="author_role"
                    {...register('author_role')}
                    className="mt-1 text-sm"
                    placeholder="e.g. Local Expert"
                  />
                </div>
                <div>
                  <ImageField
                    label="Cover image"
                    value={watch('cover_image_url')}
                    onChange={(url) => setValue('cover_image_url', url)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <SeoAssist
                  type="blog"
                  getContext={() => ({ title: watch('title'), content })}
                  onApply={(fields) => {
                    setValue('meta_title', fields.meta_title);
                    setValue('meta_description', fields.meta_description);
                  }}
                />
                <div>
                  <Label htmlFor="meta_title" className="text-xs">
                    Meta title
                  </Label>
                  <Input
                    id="meta_title"
                    {...register('meta_title')}
                    className="mt-1 text-sm"
                    placeholder="Defaults to post title"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="meta_description" className="text-xs">
                      Meta description
                    </Label>
                    <span
                      className={`text-xs tabular-nums ${(metaDesc?.length ?? 0) > 160 ? 'text-red-500' : 'text-[hsl(var(--muted-foreground))]'}`}
                    >
                      {metaDesc?.length ?? 0}/160
                    </span>
                  </div>
                  <Textarea
                    id="meta_description"
                    {...register('meta_description')}
                    className="text-sm resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">Saved.</p>
            )}

            <Button
              type="submit"
              className="w-full bg-[#265EA6] hover:bg-[#1e4e8c] text-white"
              disabled={saving}
            >
              {saving ? 'Saving…' : isNew ? 'Create Post' : 'Save Changes'}
            </Button>

            {!isNew && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete Post
                </Button>
                <ConfirmDialog
                  open={deleteOpen}
                  title={`Delete "${post!.title}"?`}
                  description="This will permanently delete the post and all its comments."
                  onConfirm={handleDelete}
                  onCancel={() => setDeleteOpen(false)}
                />
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
