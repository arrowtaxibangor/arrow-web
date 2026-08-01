'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import { useState, useRef } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TiptapImageExt from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Node as TiptapNode, mergeAttributes } from '@tiptap/core';
import type { JSONContent } from '@tiptap/core';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImageIcon,
  Palette,
  Loader2,
  X,
  Upload,
  StickyNote,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Custom callout card node — branded bordered box for in-content callouts
const CalloutCard = TiptapNode.create({
  name: 'calloutCard',
  group: 'block',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-callout': '',
        style:
          'border:2px solid #265EA6;border-left:5px solid #FEC601;background:#EEF4FB;' +
          'padding:14px 18px;border-radius:6px;margin:14px 0;',
      }),
      0,
    ];
  },
});

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

interface ImgDialogState {
  open: boolean;
  tab: 'upload' | 'url';
  url: string;
  alt: string;
  uploading: boolean;
  error: string;
}

const IMG_DIALOG_CLOSED: ImgDialogState = {
  open: false,
  tab: 'upload',
  url: '',
  alt: '',
  uploading: false,
  error: '',
};

export function TiptapEditor({ content, onChange, placeholder, className }: TiptapEditorProps) {
  const [improving, setImproving] = useState(false);
  const [imgDialog, setImgDialog] = useState<ImgDialogState>(IMG_DIALOG_CLOSED);
  const imgFileRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? 'Write content here...' }),
      TiptapImageExt.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      CalloutCard,
    ],
    content,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  if (!editor) return null;

  const ToolbarBtn = ({
    onClick,
    active,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    title?: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'p-1.5 rounded text-sm transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center',
        active
          ? 'bg-[#265EA6] text-white'
          : 'hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
      )}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-gray-300 mx-1 self-center" />;

  async function handleImgFile(file: File) {
    setImgDialog((d) => ({ ...d, uploading: true, error: '' }));
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setImgDialog((d) => ({ ...d, uploading: false, error: data.error ?? 'Upload failed' }));
        return;
      }
      setImgDialog((d) => ({ ...d, uploading: false, url: data.url ?? '' }));
    } catch {
      setImgDialog((d) => ({ ...d, uploading: false, error: 'Network error — please try again' }));
    } finally {
      if (imgFileRef.current) imgFileRef.current.value = '';
    }
  }

  function insertImage() {
    if (!imgDialog.url || !imgDialog.alt.trim()) return;
    editor.chain().focus().setImage({ src: imgDialog.url, alt: imgDialog.alt.trim() }).run();
    setImgDialog(IMG_DIALOG_CLOSED);
  }

  function insertCalloutCard() {
    const card: JSONContent = { type: 'calloutCard', content: [{ type: 'paragraph' }] };
    editor.chain().focus().insertContent(card).run();
  }

  const activeColor = (editor.getAttributes('textStyle') as { color?: string }).color ?? '';

  return (
    <>
      <div
        className={cn('border border-[hsl(var(--border))] rounded-md overflow-hidden', className)}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap gap-0.5 p-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
          {/* Inline formatting */}
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolbarBtn>

          {/* Headings */}
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="h-3.5 w-3.5" />
          </ToolbarBtn>

          {/* Lists */}
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet list"
          >
            <List className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Ordered list"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolbarBtn>

          {/* Link */}
          <ToolbarBtn
            onClick={() => {
              const url = window.prompt('URL');
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            active={editor.isActive('link')}
            title="Insert link"
          >
            <Link2 className="h-3.5 w-3.5" />
          </ToolbarBtn>

          <Divider />

          {/* Text alignment */}
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            title="Align left"
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            title="Align center"
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            title="Align right"
          >
            <AlignRight className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            active={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            <AlignJustify className="h-3.5 w-3.5" />
          </ToolbarBtn>

          <Divider />

          {/* Text color */}
          <div className="relative flex items-center gap-0.5">
            <button
              type="button"
              title="Text color"
              onClick={() => colorInputRef.current?.click()}
              className="p-1.5 rounded hover:bg-[hsl(var(--muted))] flex flex-col items-center gap-0.5"
            >
              <Palette className="h-3.5 w-3.5 text-[hsl(var(--foreground))]" />
              <span
                className="w-4 h-1 rounded-full"
                style={{ backgroundColor: activeColor || '#000000' }}
              />
            </button>
            {activeColor && (
              <button
                type="button"
                title="Remove color"
                onClick={() => editor.chain().focus().unsetColor().run()}
                className="p-0.5 rounded hover:bg-[hsl(var(--muted))] text-gray-400 hover:text-gray-600"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
            <input
              ref={colorInputRef}
              type="color"
              value={activeColor || '#000000'}
              className="sr-only"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            />
          </div>

          {/* Insert image */}
          <ToolbarBtn
            onClick={() => setImgDialog({ ...IMG_DIALOG_CLOSED, open: true })}
            title="Insert image"
          >
            <ImageIcon className="h-3.5 w-3.5" />
          </ToolbarBtn>

          {/* Insert callout card */}
          <ToolbarBtn onClick={insertCalloutCard} title="Insert callout card">
            <StickyNote className="h-3.5 w-3.5" />
          </ToolbarBtn>

          <Divider />

          {/* AI improve */}
          <button
            type="button"
            disabled={improving}
            onClick={async () => {
              const html = editor.getHTML();
              if (!html || html === '<p></p>') return;
              setImproving(true);
              try {
                const res = await fetch('/api/ai/improve', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ html }),
                });
                if (!res.ok) return;
                const reader = res.body!.getReader();
                const decoder = new TextDecoder();
                let improved = '';
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  improved += decoder.decode(value, { stream: true });
                }
                if (improved) {
                  editor.commands.setContent(improved);
                  onChange(improved);
                }
              } finally {
                setImproving(false);
              }
            }}
            className={cn(
              'px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors',
              improving
                ? 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground'
                : 'hover:bg-blue-50 text-blue-700'
            )}
            title="Improve with AI"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {improving ? 'Improving…' : 'Improve'}
          </button>
        </div>

        <EditorContent
          editor={editor}
          className="prose max-w-none p-3 min-h-[200px] focus-within:outline-none text-sm [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[180px]"
        />
      </div>

      {/* Image insert dialog */}
      {imgDialog.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setImgDialog(IMG_DIALOG_CLOSED);
          }}
        >
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Insert image</h3>
              <button
                type="button"
                onClick={() => setImgDialog(IMG_DIALOG_CLOSED)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Tab bar */}
            <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs font-medium mb-4">
              <button
                type="button"
                onClick={() => setImgDialog((d) => ({ ...d, tab: 'upload', url: '', error: '' }))}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors',
                  imgDialog.tab === 'upload'
                    ? 'bg-[#265EA6] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                )}
              >
                <Upload className="h-3 w-3" />
                Upload
              </button>
              <button
                type="button"
                onClick={() => setImgDialog((d) => ({ ...d, tab: 'url', error: '' }))}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 border-l border-gray-200 transition-colors',
                  imgDialog.tab === 'url'
                    ? 'bg-[#265EA6] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                )}
              >
                <Link2 className="h-3 w-3" />
                Paste URL
              </button>
            </div>

            {/* Upload zone */}
            {imgDialog.tab === 'upload' && (
              <div
                role="button"
                tabIndex={0}
                onClick={() => !imgDialog.uploading && imgFileRef.current?.click()}
                onKeyDown={(e) =>
                  e.key === 'Enter' && !imgDialog.uploading && imgFileRef.current?.click()
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleImgFile(file);
                }}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors mb-4',
                  imgDialog.uploading
                    ? 'border-blue-300 bg-blue-50 cursor-wait'
                    : 'border-gray-200 cursor-pointer hover:border-[#265EA6] hover:bg-blue-50/30'
                )}
              >
                {imgDialog.uploading ? (
                  <>
                    <Loader2 className="h-6 w-6 text-[#265EA6] animate-spin" />
                    <span className="text-xs text-gray-500">Uploading…</span>
                  </>
                ) : imgDialog.url ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgDialog.url} alt="" className="max-h-28 object-contain rounded" />
                    <span className="text-xs text-green-700 font-medium">Image uploaded ✓</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-gray-400" />
                    <span className="text-xs text-gray-700 font-medium">
                      Click or drag an image here
                    </span>
                    <span className="text-xs text-gray-400">
                      JPEG · PNG · WebP · GIF · AVIF — max 5 MB
                    </span>
                  </>
                )}
                <input
                  ref={imgFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImgFile(file);
                  }}
                />
              </div>
            )}

            {/* URL input */}
            {imgDialog.tab === 'url' && (
              <div className="mb-4">
                <Input
                  value={imgDialog.url}
                  onChange={(e) => setImgDialog((d) => ({ ...d, url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="text-sm"
                />
              </div>
            )}

            {imgDialog.error && <p className="text-xs text-red-600 mb-3">{imgDialog.error}</p>}

            {/* Alt text — required */}
            <div className="mb-4">
              <Label className="text-xs mb-1 block">
                Alt text <span className="text-red-500">*</span>
              </Label>
              <Input
                value={imgDialog.alt}
                onChange={(e) => setImgDialog((d) => ({ ...d, alt: e.target.value }))}
                placeholder="Describe the image for screen readers"
                className="text-sm"
              />
              {!imgDialog.alt.trim() && imgDialog.url && (
                <p className="text-xs text-amber-600 mt-1">Alt text is required before inserting</p>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setImgDialog(IMG_DIALOG_CLOSED)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!imgDialog.url || !imgDialog.alt.trim()}
                onClick={insertImage}
                className="bg-[#265EA6] hover:bg-[#1e4e8c] text-white"
              >
                Insert
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
