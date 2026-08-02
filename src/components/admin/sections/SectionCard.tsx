'use client';
import { DraggableProvided } from '@hello-pangea/dnd';
import { GripVertical, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { TiptapEditor } from './TiptapEditor';
import { GeneratePanel } from '@/components/admin/ai/GeneratePanel';
import { ImageField } from '@/components/admin/ui/ImageField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { CmsSectionInput, ButtonVariant } from '@/lib/supabase/cms';
import { SECTION_TYPE_LABELS } from '@/lib/component-registry';

interface SectionCardProps {
  section: CmsSectionInput;
  provided: DraggableProvided;
  isDragging: boolean;
  onChange: (updated: CmsSectionInput) => void;
  onDelete: () => void;
  buttonVariants?: ButtonVariant[];
}

export function SectionCard({
  section,
  provided,
  isDragging,
  onChange,
  onDelete,
  buttonVariants = [],
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
          {SECTION_TYPE_LABELS[section.type] ?? section.type}
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
                placeholder="Button URL (leave blank to use booking URL)"
                value={section.button_link ?? ''}
                onChange={(e) => update({ button_link: e.target.value })}
              />
              {buttonVariants.length > 0 && (
                <div className="space-y-1">
                  <Label className="text-xs">Button variant</Label>
                  <Select
                    value={section.button_variant_slug ?? ''}
                    onValueChange={(v) => update({ button_variant_slug: v || null })}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Default variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {buttonVariants.map((v) => (
                        <SelectItem key={v.slug} value={v.slug}>
                          <span className="flex items-center gap-2">
                            <span
                              className="inline-block h-3 w-3 rounded-full border border-gray-300 shrink-0"
                              style={{ backgroundColor: v.bg_color }}
                            />
                            {v.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
