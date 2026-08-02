'use client';
import Link from 'next/link';
import { Eye, X } from 'lucide-react';

type PreviewBannerProps = {
  editorHref: string;
  label?: string;
};

export function PreviewBanner({ editorHref, label = 'Draft preview' }: PreviewBannerProps) {
  return (
    <div
      className="sticky top-0 z-50 flex items-center justify-between gap-4 px-4 py-2.5 text-sm font-medium"
      style={{ background: '#1a3a5c', color: '#fff' }}
    >
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 shrink-0" aria-hidden />
        <span>{label} — changes not yet saved to the live site</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href={editorHref}
          className="underline underline-offset-2 hover:text-yellow-300 transition-colors text-xs"
        >
          ← Edit in CMS
        </Link>
        <button
          type="button"
          aria-label="Close preview"
          onClick={() => window.close()}
          className="p-1 hover:text-yellow-300 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
