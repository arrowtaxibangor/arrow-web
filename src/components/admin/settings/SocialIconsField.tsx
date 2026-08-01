'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  SUPPORTED_SOCIAL_ICONS,
  type SocialIcon,
  type SupportedSocialIcon,
} from '@/lib/supabase/cms';
import { SOCIAL_ICON_META } from '../../../../utils/socialMediaIcons';
import { ArrowDown, ArrowUp, Trash2, Plus } from 'lucide-react';

type Feedback = { type: 'success' | 'error'; message: string } | null;

export function SocialIconsField({ initial }: { initial: SocialIcon[] }) {
  const [icons, setIcons] = useState<SocialIcon[]>(initial);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const usedIcons = new Set(icons.map((i) => i.icon));
  const availableIcons = SUPPORTED_SOCIAL_ICONS.filter((slug) => !usedIcons.has(slug));

  function updateUrl(index: number, url: string) {
    setIcons((prev) => prev.map((item, i) => (i === index ? { ...item, url } : item)));
  }

  function move(index: number, direction: -1 | 1) {
    setIcons((prev) => {
      const next = prev.slice();
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(index: number) {
    setIcons((prev) => prev.filter((_, i) => i !== index));
  }

  function add(slug: SupportedSocialIcon) {
    setIcons((prev) => [...prev, { icon: slug, url: '' }]);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ social_icons: icons }),
      });
      if (res.status === 401) throw new Error('Session expired — please log out and log in again.');
      if (!res.ok) throw new Error(`Server error (${res.status}) — check Vercel logs.`);
      setFeedback({ type: 'success', message: 'Social icons saved.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save.',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="max-w-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Social icons</CardTitle>
        <CardDescription>
          Icons rendered in the footer. Reorder with the arrow buttons. Empty URLs are dropped on
          save.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            {icons.length === 0 && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] italic">
                No icons yet — add one below.
              </p>
            )}
            {icons.map((item, index) => {
              const meta = SOCIAL_ICON_META[item.icon];
              return (
                <div
                  key={`${item.icon}-${index}`}
                  className="flex items-center gap-2 border border-[hsl(var(--border))] rounded-md p-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={meta.src} alt="" className="w-6 h-6 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={`icon-url-${index}`} className="text-xs">
                      {meta.label}
                    </Label>
                    <Input
                      id={`icon-url-${index}`}
                      type="url"
                      value={item.url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      placeholder="https://..."
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div className="flex flex-col shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                      aria-label={`Move ${meta.label} up`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      disabled={index === icons.length - 1}
                      onClick={() => move(index, 1)}
                      aria-label={`Move ${meta.label} down`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 shrink-0"
                    onClick={() => remove(index)}
                    aria-label={`Remove ${meta.label}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          {availableIcons.length > 0 && (
            <div className="border-t border-[hsl(var(--border))] pt-3">
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">Add icon</p>
              <div className="flex flex-wrap gap-2">
                {availableIcons.map((slug) => {
                  const meta = SOCIAL_ICON_META[slug];
                  return (
                    <Button
                      key={slug}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => add(slug)}
                      className="h-8"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      {meta.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

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
            {saving ? 'Saving…' : 'Save icons'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
