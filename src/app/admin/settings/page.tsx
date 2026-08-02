'use client';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { SocialIconsField } from '@/components/admin/settings/SocialIconsField';
import type { SocialIcon, ButtonVariant } from '@/lib/supabase/cms';

const FONT_SIZE_OPTIONS = [14, 16, 18, 20] as const;
type FontSizeOption = (typeof FONT_SIZE_OPTIONS)[number];

function isValidHex(v: string) {
  return /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(v);
}

export default function SettingsPage() {
  const [bookingUrl, setBookingUrl] = useState('');
  const [socialIcons, setSocialIcons] = useState<SocialIcon[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const [ctaBgColor, setCtaBgColor] = useState('#FEC601');
  const [ctaTextColor, setCtaTextColor] = useState('#ffffff');
  const [ctaFontSize, setCtaFontSize] = useState<FontSizeOption>(18);
  const [ctaSaving, setCtaSaving] = useState(false);
  const [ctaFeedback, setCtaFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Button variants
  const [variants, setVariants] = useState<ButtonVariant[]>([]);
  const [variantSaving, setVariantSaving] = useState<string | null>(null);
  const [variantFeedback, setVariantFeedback] = useState<{
    slug: string;
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [newSlug, setNewSlug] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [addingVariant, setAddingVariant] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/settings').then((r) => r.json()),
      fetch('/api/admin/button-variants').then((r) => r.json()),
    ])
      .then(([d, bv]) => {
        setBookingUrl(d.booking_url ?? '');
        setSocialIcons(Array.isArray(d.social_icons) ? d.social_icons : []);
        if (d.cta_bg_color) setCtaBgColor(d.cta_bg_color);
        if (d.cta_text_color) setCtaTextColor(d.cta_text_color);
        if (d.cta_font_size && FONT_SIZE_OPTIONS.includes(d.cta_font_size as FontSizeOption)) {
          setCtaFontSize(d.cta_font_size as FontSizeOption);
        }
        if (Array.isArray(bv.variants)) setVariants(bv.variants as ButtonVariant[]);
      })
      .finally(() => setLoading(false));
  }, []);

  function updateVariantField<K extends keyof ButtonVariant>(
    slug: string,
    key: K,
    value: ButtonVariant[K]
  ) {
    setVariants((prev) => prev.map((v) => (v.slug === slug ? { ...v, [key]: value } : v)));
  }

  async function saveVariant(slug: string) {
    const variant = variants.find((v) => v.slug === slug);
    if (!variant) return;
    setVariantSaving(slug);
    setVariantFeedback(null);
    try {
      const res = await fetch(`/api/admin/button-variants/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: variant.label,
          bg_color: variant.bg_color,
          text_color: variant.text_color,
          font_size: variant.font_size,
          border_radius: variant.border_radius,
          padding_x: variant.padding_x,
          padding_y: variant.padding_y,
          font_weight: variant.font_weight,
          is_default: variant.is_default,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setVariantFeedback({ slug, type: 'success', message: 'Saved.' });
    } catch {
      setVariantFeedback({ slug, type: 'error', message: 'Failed to save.' });
    } finally {
      setVariantSaving(null);
    }
  }

  async function deleteVariant(slug: string) {
    if (!confirm(`Delete variant "${slug}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/button-variants/${slug}`, { method: 'DELETE' });
    setVariants((prev) => prev.filter((v) => v.slug !== slug));
  }

  async function addVariant() {
    if (!newSlug.trim() || !newLabel.trim()) return;
    setAddingVariant(true);
    try {
      const res = await fetch('/api/admin/button-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: newSlug.trim(), label: newLabel.trim() }),
      });
      if (!res.ok) throw new Error('Failed');
      const { variant } = (await res.json()) as { variant: ButtonVariant };
      setVariants((prev) => [...prev, variant]);
      setNewSlug('');
      setNewLabel('');
    } catch {
      alert('Failed to add variant.');
    } finally {
      setAddingVariant(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_url: bookingUrl }),
      });
      if (res.status === 401) throw new Error('Session expired — please log out and log in again.');
      if (!res.ok) throw new Error(`Server error (${res.status}) — check Vercel logs.`);
      setFeedback({ type: 'success', message: 'Booking URL saved successfully.' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to save. Try again.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveCtaStyle() {
    if (!isValidHex(ctaBgColor) || !isValidHex(ctaTextColor)) {
      setCtaFeedback({ type: 'error', message: 'Enter valid hex colours (e.g. #FEC601).' });
      return;
    }
    setCtaSaving(true);
    setCtaFeedback(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cta_bg_color: ctaBgColor,
          cta_text_color: ctaTextColor,
          cta_font_size: ctaFontSize,
        }),
      });
      if (res.status === 401) throw new Error('Session expired — please log out and log in again.');
      if (!res.ok) throw new Error(`Server error (${res.status})`);
      setCtaFeedback({ type: 'success', message: 'Button style saved.' });
    } catch {
      setCtaFeedback({ type: 'error', message: 'Failed to save. Try again.' });
    } finally {
      setCtaSaving(false);
    }
  }

  return (
    <div className="px-6 py-6 space-y-6">
      <PageHeader
        title="Settings"
        description="Global site configuration"
        className="px-0 pt-0 mb-0"
      />

      <Card className="max-w-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Booking URL</CardTitle>
          <CardDescription>
            The iCabby URL used by all &ldquo;Book Online&rdquo; buttons across the site. Changes
            take effect immediately — no revalidation needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-10 bg-[hsl(var(--muted))] animate-pulse rounded-md" />
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="booking-url">Booking URL</Label>
                <Input
                  id="booking-url"
                  type="url"
                  value={bookingUrl}
                  onChange={(e) => setBookingUrl(e.target.value)}
                  placeholder="https://..."
                  required
                />
              </div>
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
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card className="max-w-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">CTA Button Style</CardTitle>
          <CardDescription>
            Controls the colour and size of all &ldquo;Book Online&rdquo; buttons across the site.
            The live preview below updates instantly as you make changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-[hsl(var(--muted))] animate-pulse rounded-md" />
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label>Background colour</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={isValidHex(ctaBgColor) ? ctaBgColor : '#FEC601'}
                    onChange={(e) => setCtaBgColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-[hsl(var(--border))] p-0.5"
                  />
                  <Input
                    value={ctaBgColor}
                    onChange={(e) => setCtaBgColor(e.target.value)}
                    className="font-mono w-32"
                    placeholder="#FEC601"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Text colour</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={isValidHex(ctaTextColor) ? ctaTextColor : '#ffffff'}
                    onChange={(e) => setCtaTextColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-[hsl(var(--border))] p-0.5"
                  />
                  <Input
                    value={ctaTextColor}
                    onChange={(e) => setCtaTextColor(e.target.value)}
                    className="font-mono w-32"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Text size</Label>
                <div className="flex gap-2">
                  {FONT_SIZE_OPTIONS.map((s) => (
                    <Button
                      key={s}
                      type="button"
                      variant={ctaFontSize === s ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCtaFontSize(s)}
                      className={ctaFontSize === s ? 'bg-[#265EA6] hover:bg-[#1e4e8c]' : ''}
                    >
                      {s}px
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Live preview</Label>
                <div className="flex items-center justify-center rounded-lg bg-[hsl(var(--muted))] p-8">
                  <span
                    style={{
                      backgroundColor: isValidHex(ctaBgColor) ? ctaBgColor : '#FEC601',
                      color: isValidHex(ctaTextColor) ? ctaTextColor : '#ffffff',
                      fontSize: ctaFontSize,
                      padding: '14px 36px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      display: 'inline-block',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      fontFamily: 'inherit',
                      letterSpacing: '0.01em',
                    }}
                  >
                    Book Online
                  </span>
                </div>
              </div>

              {ctaFeedback && (
                <p
                  className={`text-sm px-3 py-2 rounded-md ${
                    ctaFeedback.type === 'success'
                      ? 'text-green-700 bg-green-50'
                      : 'text-red-600 bg-red-50'
                  }`}
                >
                  {ctaFeedback.message}
                </p>
              )}
              <Button
                type="button"
                onClick={handleSaveCtaStyle}
                className="bg-[#265EA6] hover:bg-[#1e4e8c] text-white"
                disabled={ctaSaving}
              >
                {ctaSaving ? 'Saving…' : 'Save button style'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {loading || socialIcons === null ? (
        <div className="max-w-xl h-40 bg-[hsl(var(--muted))] animate-pulse rounded-md" />
      ) : (
        <SocialIconsField initial={socialIcons} />
      )}

      <Card className="max-w-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Button Variants</CardTitle>
          <CardDescription>
            Named button styles used by CMS page sections. Changes take effect immediately across
            all pages that reference each variant.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-24 bg-[hsl(var(--muted))] animate-pulse rounded-md" />
              ))}
            </div>
          ) : (
            <>
              {variants.length === 0 && (
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  No variants yet. Add one below.
                </p>
              )}

              {variants.map((v) => (
                <div
                  key={v.slug}
                  className="border border-[hsl(var(--border))] rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{v.label}</span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))] font-mono">
                        {v.slug}
                      </span>
                      {v.is_default && (
                        <span className="text-xs bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded">
                          default
                        </span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => void deleteVariant(v.slug)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={v.label}
                        onChange={(e) => updateVariantField(v.slug, 'label', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Font weight</Label>
                      <Input
                        type="number"
                        value={v.font_weight ?? 700}
                        onChange={(e) =>
                          updateVariantField(v.slug, 'font_weight', Number(e.target.value))
                        }
                        className="text-sm"
                        placeholder="700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Background colour</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={
                            isValidHex(v.bg_color ?? '') ? (v.bg_color ?? '#FEC601') : '#FEC601'
                          }
                          onChange={(e) => updateVariantField(v.slug, 'bg_color', e.target.value)}
                          className="h-8 w-10 cursor-pointer rounded border border-[hsl(var(--border))] p-0.5 shrink-0"
                        />
                        <Input
                          value={v.bg_color ?? ''}
                          onChange={(e) => updateVariantField(v.slug, 'bg_color', e.target.value)}
                          className="font-mono text-sm"
                          placeholder="#FEC601"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Text colour</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={
                            isValidHex(v.text_color ?? '') ? (v.text_color ?? '#ffffff') : '#ffffff'
                          }
                          onChange={(e) => updateVariantField(v.slug, 'text_color', e.target.value)}
                          className="h-8 w-10 cursor-pointer rounded border border-[hsl(var(--border))] p-0.5 shrink-0"
                        />
                        <Input
                          value={v.text_color ?? ''}
                          onChange={(e) => updateVariantField(v.slug, 'text_color', e.target.value)}
                          className="font-mono text-sm"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Font size (px)</Label>
                      <Input
                        type="number"
                        value={v.font_size ?? 18}
                        onChange={(e) =>
                          updateVariantField(v.slug, 'font_size', Number(e.target.value))
                        }
                        className="text-sm"
                        placeholder="18"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Border radius (px)</Label>
                      <Input
                        type="number"
                        value={v.border_radius ?? 12}
                        onChange={(e) =>
                          updateVariantField(v.slug, 'border_radius', Number(e.target.value))
                        }
                        className="text-sm"
                        placeholder="12"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Padding X (px)</Label>
                      <Input
                        type="number"
                        value={v.padding_x ?? 36}
                        onChange={(e) =>
                          updateVariantField(v.slug, 'padding_x', Number(e.target.value))
                        }
                        className="text-sm"
                        placeholder="36"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Padding Y (px)</Label>
                      <Input
                        type="number"
                        value={v.padding_y ?? 14}
                        onChange={(e) =>
                          updateVariantField(v.slug, 'padding_y', Number(e.target.value))
                        }
                        className="text-sm"
                        placeholder="14"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Live preview</Label>
                    <div className="flex items-center justify-center rounded-md bg-[hsl(var(--muted))] py-5">
                      <span
                        style={{
                          backgroundColor: isValidHex(v.bg_color ?? '')
                            ? (v.bg_color ?? '#FEC601')
                            : '#FEC601',
                          color: isValidHex(v.text_color ?? '')
                            ? (v.text_color ?? '#ffffff')
                            : '#ffffff',
                          fontSize: v.font_size ?? 18,
                          padding: `${v.padding_y ?? 14}px ${v.padding_x ?? 36}px`,
                          borderRadius: v.border_radius ?? 12,
                          fontWeight: v.font_weight ?? 700,
                          display: 'inline-block',
                          fontFamily: 'inherit',
                        }}
                      >
                        Book Online
                      </span>
                    </div>
                  </div>

                  {variantFeedback?.slug === v.slug && (
                    <p
                      className={`text-sm px-3 py-2 rounded-md ${
                        variantFeedback.type === 'success'
                          ? 'text-green-700 bg-green-50'
                          : 'text-red-600 bg-red-50'
                      }`}
                    >
                      {variantFeedback.message}
                    </p>
                  )}

                  <Button
                    type="button"
                    onClick={() => void saveVariant(v.slug)}
                    className="bg-[#265EA6] hover:bg-[#1e4e8c] text-white"
                    disabled={variantSaving === v.slug}
                    size="sm"
                  >
                    {variantSaving === v.slug ? 'Saving…' : 'Save variant'}
                  </Button>
                </div>
              ))}

              <div className="border border-dashed border-[hsl(var(--border))] rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium">Add new variant</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Slug</Label>
                    <Input
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      className="font-mono text-sm"
                      placeholder="e.g. secondary-blue"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      className="text-sm"
                      placeholder="e.g. Secondary Blue"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void addVariant()}
                  disabled={addingVariant || !newSlug.trim() || !newLabel.trim()}
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  {addingVariant ? 'Adding…' : 'Add variant'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
