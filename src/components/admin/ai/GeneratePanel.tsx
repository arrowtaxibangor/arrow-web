'use client';
import { useState } from 'react';

interface Props {
  onInsert: (html: string) => void;
}

export function GeneratePanel({ onInsert }: Props) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setPreview('');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone, length }),
      });

      if (!res.ok) {
        setError('Generation failed. Check your session and try again.');
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setPreview(accumulated);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    'w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="mt-3 border border-dashed border-blue-300 rounded-lg bg-blue-50/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <span className="text-base">✨</span>
        {open ? 'Hide AI Generator' : 'Generate with AI'}
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Topic / prompt</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Why choose Arrow Taxi for airport transfers"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className={inputCls}>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className={inputCls}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={loading || !topic.trim()}
            className="self-start px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Generate'}
          </button>

          {error && <p className="text-xs text-red-600">{error}</p>}

          {preview && (
            <div className="flex flex-col gap-2">
              <div
                className="prose prose-sm max-w-none border border-gray-200 rounded bg-white p-3 max-h-64 overflow-y-auto text-sm"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onInsert(preview);
                    setOpen(false);
                    setPreview('');
                    setTopic('');
                  }}
                  className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors"
                >
                  Insert into editor
                </button>
                <button
                  type="button"
                  onClick={generate}
                  disabled={loading}
                  className="px-4 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
