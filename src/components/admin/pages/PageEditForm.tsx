'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { CmsPage, CmsSectionInput } from '@/lib/supabase/cms';
import { SectionEditor } from '@/components/admin/sections/SectionEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { SeoAssist } from '@/components/admin/ai/SeoAssist';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';

type MetaFields = {
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  og_image_url: string;
  google_tag: string;
  is_published: boolean;
  is_in_header: boolean;
  has_booking_button: boolean;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function PageEditForm({ page }: { page?: CmsPage }) {
  const router = useRouter();
  const isNew = !page;

  const [sections, setSections] = useState<CmsSectionInput[]>(
    page?.sections?.map(
      ({ sort_order, type, content, image_url, image_alt, button_text, button_link, html }) => ({
        sort_order,
        type,
        content,
        image_url,
        image_alt,
        button_text,
        button_link,
        html,
      })
    ) ?? []
  );
  const [slugManual, setSlugManual] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MetaFields>({
    defaultValues: {
      title: page?.title ?? '',
      slug: page?.slug ?? '',
      meta_title: page?.meta_title ?? '',
      meta_description: page?.meta_description ?? '',
      meta_keywords: page?.meta_keywords ?? '',
      canonical_url: page?.canonical_url ?? '',
      og_image_url: page?.og_image_url ?? '',
      google_tag: page?.google_tag ?? '',
      is_published: page?.is_published ?? false,
      is_in_header: page?.is_in_header ?? false,
      has_booking_button: page?.has_booking_button ?? false,
    },
  });

  const title = watch('title');
  const metaDesc = watch('meta_description');

  useEffect(() => {
    if (!slugManual && title) {
      setValue('slug', slugify(title));
    }
  }, [title, slugManual, setValue]);

  const onSubmit = async (data: MetaFields) => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      let workingSlug = data.slug;

      const payload = {
        title: data.title,
        slug: data.slug,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        meta_keywords: data.meta_keywords || null,
        canonical_url: data.canonical_url || null,
        og_image_url: data.og_image_url || null,
        google_tag: data.google_tag || null,
        is_published: data.is_published,
        is_in_header: data.is_in_header,
        has_booking_button: data.has_booking_button,
      };

      if (isNew) {
        const res = await fetch('/api/cms/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const e = await res.json();
          throw new Error(e.error ?? 'Failed to create page');
        }
        const { page: created } = await res.json();
        workingSlug = created.slug;
      } else {
        const res = await fetch(`/api/cms/pages/${page!.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const e = await res.json();
          throw new Error(e.error ?? 'Failed to update page');
        }
        workingSlug = data.slug;
      }

      const sectionsRes = await fetch(`/api/cms/pages/${workingSlug}/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });
      if (!sectionsRes.ok) throw new Error('Failed to save sections');

      await fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: workingSlug }),
      });

      setSuccess(true);
      if (isNew) {
        router.push('/admin/pages');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
          <Link href="/admin/pages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={isNew ? 'New Page' : `Edit: ${page!.title}`}
          className="px-0 pt-0 mb-0"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sections panel */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  className="mt-1"
                  placeholder="Page title"
                />
                {errors.title && (
                  <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <div className="flex items-center mt-1 gap-1">
                  <span className="text-sm text-[hsl(var(--muted-foreground))] shrink-0">/</span>
                  <Input
                    id="slug"
                    {...register('slug', { required: 'Slug is required' })}
                    onFocus={() => setSlugManual(true)}
                    placeholder="page-slug"
                    className="font-mono text-sm"
                  />
                </div>
                {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
              </div>
            </div>
            <SectionEditor sections={sections} onChange={setSections} />
          </div>

          {/* Meta sidebar */}
          <div className="lg:w-72 space-y-4 shrink-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_published" className="cursor-pointer text-sm">
                    Published
                  </Label>
                  <Switch
                    id="is_published"
                    checked={watch('is_published')}
                    onCheckedChange={(v) => setValue('is_published', v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_in_header" className="cursor-pointer text-sm">
                    Show in header nav
                  </Label>
                  <Switch
                    id="is_in_header"
                    checked={watch('is_in_header')}
                    onCheckedChange={(v) => setValue('is_in_header', v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="has_booking_button" className="cursor-pointer text-sm">
                    Booking button
                  </Label>
                  <Switch
                    id="has_booking_button"
                    checked={watch('has_booking_button')}
                    onCheckedChange={(v) => setValue('has_booking_button', v)}
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
                  type="page"
                  getContext={() => ({
                    title: watch('title'),
                    content: sections
                      .filter((s) => s.type === 'TEXT')
                      .map((s) => s.content ?? '')
                      .join(' '),
                  })}
                  onApply={(fields) => {
                    setValue('meta_title', fields.meta_title);
                    setValue('meta_description', fields.meta_description);
                    setValue('meta_keywords', fields.meta_keywords);
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
                    placeholder="Defaults to page title"
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
                    placeholder="160 chars recommended"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_keywords" className="text-xs">
                    Keywords
                  </Label>
                  <Input
                    id="meta_keywords"
                    {...register('meta_keywords')}
                    className="mt-1 text-sm"
                    placeholder="comma, separated"
                  />
                </div>
                <div>
                  <Label htmlFor="canonical_url" className="text-xs">
                    Canonical URL
                  </Label>
                  <Input
                    id="canonical_url"
                    {...register('canonical_url')}
                    className="mt-1 text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="og_image_url" className="text-xs">
                    OG image URL
                  </Label>
                  <Input
                    id="og_image_url"
                    {...register('og_image_url')}
                    className="mt-1 text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="google_tag" className="text-xs">
                    Google tag
                  </Label>
                  <Input
                    id="google_tag"
                    {...register('google_tag')}
                    className="mt-1 text-sm font-mono"
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
              </CardContent>
            </Card>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">
                Saved successfully.
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-[#265EA6] hover:bg-[#1e4e8c] text-white"
              disabled={saving}
            >
              {saving ? 'Saving…' : isNew ? 'Create Page' : 'Save Changes'}
            </Button>

            {!isNew && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  window.open(`https://www.arrow.taxi/${page!.slug}`, '_blank', 'noopener')
                }
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview page
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
