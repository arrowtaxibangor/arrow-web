'use client';
import { useState } from 'react';
import { Check, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AdminComment } from '@/lib/supabase/blog';

interface CommentsActionsProps {
  comment: AdminComment;
  onUpdate: (id: string, approved: boolean | null) => void;
}

export function CommentsActions({ comment, onUpdate }: CommentsActionsProps) {
  const [busy, setBusy] = useState(false);

  async function approve() {
    setBusy(true);
    await fetch(`/api/blog/${comment.post_slug}/comments/${comment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: true }),
    });
    onUpdate(comment.id, true);
    setBusy(false);
  }

  async function reject() {
    setBusy(true);
    await fetch(`/api/blog/${comment.post_slug}/comments/${comment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: false }),
    });
    onUpdate(comment.id, false);
    setBusy(false);
  }

  async function remove() {
    setBusy(true);
    await fetch(`/api/blog/${comment.post_slug}/comments/${comment.id}`, { method: 'DELETE' });
    onUpdate(comment.id, null);
    setBusy(false);
  }

  return (
    <div className="flex items-center gap-1">
      {!comment.approved && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
          onClick={approve}
          disabled={busy}
          title="Approve"
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
      )}
      {comment.approved && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50"
          onClick={reject}
          disabled={busy}
          title="Reject"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
        onClick={remove}
        disabled={busy}
        title="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
