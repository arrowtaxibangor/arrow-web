'use client';
import { DraggableProvided } from '@hello-pangea/dnd';
import { GripVertical, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { TiptapEditor } from './TiptapEditor';
import { GeneratePanel } from '@/components/admin/ai/GeneratePanel';
import { ImageField } from '@/components/admin/ui/ImageField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { CmsSectionInput } from '@/lib/supabase/cms';

interface SectionCardProps {
  section: CmsSectionInput;
  provided: DraggableProvided;
  isDragging: boolean;
  onChange: (updated: CmsSectionInput) => void;
  onDelete: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  TEXT: 'Text Block',
  IMAGE: 'Image',
  BUTTON: 'Button',
  AD_CODE: 'Ad / Embed Code',
  HERO: 'Hero Code',
};

export function SectionCard({
  section,
  provided,
  isDragging,
  onChange,
  onDelete,
}: SectionCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const update = (patch: Partial<CmsSectionInput>) => onChange({ ...section, ...patch });

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={cn(
        'border border-[hsl(var(--border))] rounded-lg bg-white overflow-hidden',
        isDragging && 'shadow-lg ring-2 ring-[#265EA6]'
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))]">
        <div
          {...provided.dragHandleProps}
          className="cursor-grab active:cursor-grabbing p-1 min-h-[44px] flex items-center"
        >
          <GripVertical className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        </div>
        <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide flex-1">
          {TYPE_LABELS[section.type] ?? section.type}
        </span>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 min-h-[44px] flex items-center"
        >
          {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1 min-h-[44px] flex items-center text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-3">
          {section.type === 'TEXT' && (
            <>
              <TiptapEditor
                content={section.content ?? ''}
                onChange={(html) => update({ content: html })}
                placeholder="Enter text content..."
              />
              <GeneratePanel
                onInsert={(html) => update({ content: (section.content ?? '') + html })}
              />
            </>
          )}
          {section.type === 'IMAGE' && (
            <ImageField
              value={section.image_url ?? ''}
              onChange={(url) => update({ image_url: url })}
              alt={section.image_alt ?? ''}
              onAltChange={(alt) => update({ image_alt: alt })}
            />
          )}
          {section.type === 'BUTTON' && (
            <>
              <Input
                placeholder="Button text (e.g. Book Me)"
                value={section.button_text ?? ''}
                onChange={(e) => update({ button_text: e.target.value })}
              />
              <Input
                placeholder="Button URL"
                value={section.button_link ?? ''}
                onChange={(e) => update({ button_link: e.target.value })}
              />
            </>
          )}
          {(section.type === 'AD_CODE' || section.type === 'HERO') && (
            <Textarea
              placeholder="Raw HTML / embed code"
              value={section.html ?? ''}
              onChange={(e) => update({ html: e.target.value })}
              className="font-mono text-xs min-h-[120px]"
            />
          )}
        </div>
      )}
    </div>
  );
}
