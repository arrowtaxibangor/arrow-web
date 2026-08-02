'use client';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SocialIconsField } from '@/components/admin/settings/SocialIconsField';
import type { SocialIcon } from '@/lib/supabase/cms';

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

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        setBookingUrl(d.booking_url ?? '');
        setSocialIcons(Array.isArray(d.social_icons) ? d.social_icons : []);
        if (d.cta_bg_color) setCtaBgColor(d.cta_bg_color);
        if (d.cta_text_color) setCtaTextColor(d.cta_text_color);
        if (d.cta_font_size && FONT_SIZE_OPTIONS.includes(d.cta_font_size as FontSizeOption)) {
          setCtaFontSize(d.cta_font_size as FontSizeOption);
        }
      })
      .finally(() => setLoading(false));
  }, []);

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
    </div>
  );
}
