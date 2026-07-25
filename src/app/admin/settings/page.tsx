'use client';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const [bookingUrl, setBookingUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => setBookingUrl(d.booking_url ?? ''))
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
      if (!res.ok) throw new Error('Failed');
      setFeedback({ type: 'success', message: 'Booking URL saved successfully.' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to save. Try again.' });
    } finally {
      setSaving(false);
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
            The iCabby URL used by all &ldquo;Book Me&rdquo; buttons across the site. Changes take
            effect immediately — no revalidation needed.
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
    </div>
  );
}
