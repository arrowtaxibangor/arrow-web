'use client';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImageField } from '@/components/admin/ui/ImageField';
import type { HomepageContent } from '@/lib/supabase/homepage';
import { TiptapEditor } from '@/components/admin/sections/TiptapEditor';

const DEFAULT_AREAS_HTML = `<p>Arrow Taxi Bangor is the new rising star of Gwynedd taxi services. Whether you are looking to book a long distance ride or a local night out, you can book with confidence. We offer nice clean cars and friendly professional drivers.</p><p>If you are a tourist looking to book a taxi for a day/week you are welcome to discuss your plans with the driver and they can then give you our best quote.</p><h2>Popular Areas We Cover:</h2><ul><li>Gwynedd</li><li>Bangor Train Station</li><li>Caernarfon</li><li>Snowdonia National Park</li><li>Beddgelert</li><li>South Stack, Anglesey</li><li>Penmon Lighthouse, Anglesey</li><li>Porthmadog</li><li>Pwllheli</li></ul>`;

const DEFAULTS: HomepageContent = {
  banner_heading: 'Arrow Taxi Bangor',
  banner_subtext: `Taxis across Bangor, Caernarfon and Gwynedd — 24/7. Book online or call us.`,
  banner_image: '/Assets/Images/BannerImg.jpeg',
  hero_heading: "Bangor's Trusted Taxi Service",
  hero_subtext: 'Professional, reliable rides across North Wales — available 24/7.',
  hero_cta_label: 'Book Online',
  hero_background_image: '/Assets/Images/homeBgWave.png',
  meta_title: 'Bangor Taxi - Top Rated North Wales Taxi Service',
  meta_description:
    'Call us on 01248209393 to book your taxi. We are based in Bangor, Gwynedd and operate 24/7. Snowdon, Tryfan, Beddgelert, Pwllheli, Caernarfon, Anglesey. To and from all major airports',
  og_image_url: 'https://www.arrow.taxi/Assets/Images/BannerImg.jpeg',
  phone_number: '+441248209393',
  areas_html: DEFAULT_AREAS_HTML,
};

export default function HomepageCmsPage() {
  const [form, setForm] = useState<HomepageContent>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    fetch('/api/admin/homepage')
      .then((r) => r.json())
      .then((data: HomepageContent) => {
        setForm((prev) => ({
          ...prev,
          ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== null && v !== '')),
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  function set(key: keyof HomepageContent, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.status === 401) throw new Error('Session expired — please log out and log in again.');
      if (!res.ok) throw new Error(`Server error (${res.status})`);
      setFeedback({ type: 'success', message: 'Homepage content saved.' });
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save. Try again.',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-6 py-6 space-y-6">
      <PageHeader
        title="Homepage"
        description="Edit the hero text, CTA, background image, and page metadata."
        className="px-0 pt-0 mb-0"
      />

      {loading ? (
        <div className="space-y-4 max-w-2xl">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-[hsl(var(--muted))] animate-pulse rounded-md" />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          {/* Banner — full-width hero with taxi car photo */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Banner (header image)</CardTitle>
              <CardDescription>
                The full-width hero at the very top of the page with the car photo background.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="banner_heading">Heading</Label>
                <Input
                  id="banner_heading"
                  value={form.banner_heading ?? ''}
                  onChange={(e) => set('banner_heading', e.target.value)}
                  placeholder="Arrow Taxi Bangor"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="banner_subtext">Subtext</Label>
                <Input
                  id="banner_subtext"
                  value={form.banner_subtext ?? ''}
                  onChange={(e) => set('banner_subtext', e.target.value)}
                  placeholder="Taxis across Bangor, Caernarfon and Gwynedd — 24/7."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Background image</Label>
                <ImageField
                  value={form.banner_image ?? ''}
                  onChange={(url) => set('banner_image', url)}
                  label=""
                />
              </div>
            </CardContent>
          </Card>

          {/* Wave section — blue gradient panel below the banner */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Wave section</CardTitle>
              <CardDescription>
                The blue wave panel below the banner with a second heading and CTA.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="hero_heading">Heading</Label>
                <Input
                  id="hero_heading"
                  value={form.hero_heading ?? ''}
                  onChange={(e) => set('hero_heading', e.target.value)}
                  placeholder="Bangor's Trusted Taxi Service"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hero_subtext">Subtext</Label>
                <Input
                  id="hero_subtext"
                  value={form.hero_subtext ?? ''}
                  onChange={(e) => set('hero_subtext', e.target.value)}
                  placeholder="Professional, reliable rides across North Wales — available 24/7."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hero_cta_label">CTA button label</Label>
                <Input
                  id="hero_cta_label"
                  value={form.hero_cta_label ?? ''}
                  onChange={(e) => set('hero_cta_label', e.target.value)}
                  placeholder="Book Online"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Background image</Label>
                <ImageField
                  value={form.hero_background_image ?? ''}
                  onChange={(url) => set('hero_background_image', url)}
                  label=""
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">SEO &amp; metadata</CardTitle>
              <CardDescription>
                Controls the browser tab title, Google snippet, and social preview.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="meta_title">Page title</Label>
                <Input
                  id="meta_title"
                  value={form.meta_title ?? ''}
                  onChange={(e) => set('meta_title', e.target.value)}
                  placeholder="Bangor Taxi - Top Rated North Wales Taxi Service"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meta_description">Meta description</Label>
                <Textarea
                  id="meta_description"
                  rows={3}
                  value={form.meta_description ?? ''}
                  onChange={(e) => set('meta_description', e.target.value)}
                  placeholder="Call us on 01248209393 to book your taxi…"
                  className="resize-none text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label>OG / social share image</Label>
                <ImageField
                  value={form.og_image_url ?? ''}
                  onChange={(url) => set('og_image_url', url)}
                  label=""
                />
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Recommended: 1200 × 630 px. Shown when the homepage is shared on social media.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Business details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Business details</CardTitle>
              <CardDescription>
                Used in structured data (JSON-LD) for search engines.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone_number">Phone number</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={form.phone_number ?? ''}
                  onChange={(e) => set('phone_number', e.target.value)}
                  placeholder="+441248209393"
                />
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  E.164 format, e.g. +441248209393
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Areas We Cover */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Areas We Cover</CardTitle>
              <CardDescription>
                Rich-text block shown below the payment methods on the homepage. Use headings for
                section titles and bullet lists for area names — lists auto-render in three columns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TiptapEditor
                content={form.areas_html ?? ''}
                onChange={(html) => set('areas_html', html)}
                placeholder="Add intro paragraphs, a heading, and a bulleted list of areas…"
              />
            </CardContent>
          </Card>

          {feedback && (
            <p
              className={`text-sm px-3 py-2 rounded-md ${
                feedback.type === 'success'
                  ? 'text-green-700 bg-green-50'
                  : 'text-red-600 bg-red-50'
              }`}
            >
              {feedback.message}
            </p>
          )}

          <Button
            type="submit"
            className="bg-[#265EA6] hover:bg-[#1e4e8c] text-white"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save homepage content'}
          </Button>
        </form>
      )}
    </div>
  );
}
