'use client';
import { useState } from 'react';

interface SeoFields {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

interface Props {
  getContext: () => { title?: string; content?: string };
  type: 'blog' | 'page';
  onApply: (fields: SeoFields) => void;
}

export function SeoAssist({ getContext, type, onApply }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<SeoFields | null>(null);

  async function generate() {
    setLoading(true);
    setError('');
    setPreview(null);

    const { title, content } = getContext();

    try {
      const res = await fetch('/api/ai/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, type }),
      });

      if (!res.ok) {
        setError('SEO generation failed. Try again.');
        return;
      }

      const data = await res.json();
      setPreview(data);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
      >
        <span>✨</span>
        {loading ? 'Generating SEO…' : 'Generate SEO with AI'}
      </button>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {preview && (
        <div className="flex flex-col gap-2 border border-gray-200 rounded-lg p-3 bg-gray-50 text-xs">
          <div>
            <span className="font-medium text-gray-500">Title</span>
            <p className="text-gray-800 mt-0.5">{preview.meta_title}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Description</span>
            <p className="text-gray-800 mt-0.5">{preview.meta_description}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Keywords</span>
            <p className="text-gray-800 mt-0.5">{preview.meta_keywords}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onApply(preview);
              setPreview(null);
            }}
            className="self-start mt-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
          >
            Apply to fields
          </button>
        </div>
      )}
    </div>
  );
}
