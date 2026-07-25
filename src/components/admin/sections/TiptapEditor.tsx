'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import { useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link2, Sparkles } from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({ content, onChange, placeholder, className }: TiptapEditorProps) {
  const [improving, setImproving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? 'Write content here...' }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const ToolbarBtn = ({
    onClick,
    active,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
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

  return (
    <div className={cn('border border-[hsl(var(--border))] rounded-md overflow-hidden', className)}>
      <div className="flex flex-wrap gap-0.5 p-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => {
            const url = window.prompt('URL');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          active={editor.isActive('link')}
        >
          <Link2 className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <div className="w-px h-5 bg-gray-300 mx-1 self-center" />
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
  );
}
