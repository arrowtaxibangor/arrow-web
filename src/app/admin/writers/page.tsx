'use client';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { WriterProfile } from '@/lib/supabase/blog';

const EMPTY = {
  name: '',
  role: '',
  email: '',
  bio: '',
  avatar_url: '',
  twitter_handle: '',
  linkedin_url: '',
};

export default function WritersPage() {
  const [writers, setWriters] = useState<WriterProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WriterProfile | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<WriterProfile | null>(null);

  async function load() {
    const res = await fetch('/api/admin/writers');
    const data = await res.json();
    setWriters(data.writers ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setDialogOpen(true);
  }

  function openEdit(w: WriterProfile) {
    setEditing(w);
    setForm({
      name: w.name,
      role: w.role ?? '',
      email: w.email ?? '',
      bio: w.bio ?? '',
      avatar_url: w.avatar_url ?? '',
      twitter_handle: w.twitter_handle ?? '',
      linkedin_url: w.linkedin_url ?? '',
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v || null]));
    payload.name = form.name;
    if (editing) {
      await fetch(`/api/admin/writers/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/admin/writers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setDialogOpen(false);
    load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/writers/${deleteTarget.id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    load();
  }

  return (
    <div className="px-6 py-6">
      <PageHeader
        title="Writer Profiles"
        description="Author profiles linked to blog posts"
        className="px-0 pt-0 mb-6"
        action={
          <Button onClick={openCreate} className="bg-[#265EA6] hover:bg-[#1e4e8c] text-white">
            <Plus className="h-4 w-4 mr-1" />
            New Writer
          </Button>
        }
      />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-[hsl(var(--muted))] animate-pulse rounded-lg" />
          ))}
        </div>
      ) : writers.length === 0 ? (
        <p className="text-sm text-[hsl(var(--muted-foreground))] py-10 text-center">
          No writer profiles yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {writers.map((w) => (
            <Card key={w.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{w.name}</p>
                    {w.role && (
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{w.role}</p>
                    )}
                    {w.email && (
                      <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                        {w.email}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openEdit(w)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                      onClick={() => setDeleteTarget(w)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {w.bio && (
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 line-clamp-2">
                    {w.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md admin-root">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Writer' : 'New Writer'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {(
              [
                ['name', 'Name *'],
                ['role', 'Role'],
                ['email', 'Email'],
                ['avatar_url', 'Avatar URL'],
                ['twitter_handle', 'Twitter handle'],
                ['linkedin_url', 'LinkedIn URL'],
              ] as [keyof typeof form, string][]
            ).map(([key, label]) => (
              <div key={key}>
                <Label htmlFor={key} className="text-xs">
                  {label}
                </Label>
                <Input
                  id={key}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="mt-1 text-sm"
                />
              </div>
            ))}
            <div>
              <Label htmlFor="bio" className="text-xs">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                className="mt-1 text-sm resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#265EA6] hover:bg-[#1e4e8c] text-white"
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        description="Posts by this writer will lose the profile link but are not deleted."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
