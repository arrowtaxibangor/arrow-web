'use client';
import { useRef, useState } from 'react';
import { Upload, Link2, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  /** Renders an alt-text input below the preview when provided */
  alt?: string;
  onAltChange?: (alt: string) => void;
}

export function ImageField({ value, onChange, label, alt, onAltChange }: ImageFieldProps) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Upload failed');
        return;
      }
      onChange(data.url);
    } catch {
      setError('Network error — please try again');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-xs font-medium text-gray-600">{label}</span>}

      {/* Tab bar */}
      <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs font-medium select-none">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 transition-colors',
            tab === 'upload' ? 'bg-[#265EA6] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          )}
        >
          <Upload className="h-3 w-3" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 border-l border-gray-200 transition-colors',
            tab === 'url' ? 'bg-[#265EA6] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          )}
        >
          <Link2 className="h-3 w-3" />
          Paste URL
        </button>
      </div>

      {/* Upload drop zone */}
      {tab === 'upload' && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !uploading && fileRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && !uploading && fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          className={cn(
            'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            uploading
              ? 'border-blue-300 bg-blue-50 cursor-wait'
              : 'border-gray-200 cursor-pointer hover:border-[#265EA6] hover:bg-blue-50/30'
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 text-[#265EA6] animate-spin" />
              <span className="text-xs text-gray-500">Uploading…</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-gray-400" />
              <span className="text-xs text-gray-700 font-medium">Click or drag an image here</span>
              <span className="text-xs text-gray-400">
                JPEG · PNG · WebP · GIF · AVIF — max 5 MB
              </span>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      )}

      {/* URL input */}
      {tab === 'url' && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="text-sm"
        />
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Preview with clear */}
      {value && (
        <div className="relative group w-full rounded-md overflow-hidden border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={alt ?? ''} className="w-full max-h-44 object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            title="Remove image"
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Optional alt text */}
      {onAltChange !== undefined && (
        <Input
          value={alt ?? ''}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Alt text (describe the image)"
          className="text-sm"
        />
      )}
    </div>
  );
}
