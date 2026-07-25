'use client';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionCard } from './SectionCard';
import type { CmsSectionInput } from '@/lib/supabase/cms';

type SectionType = 'TEXT' | 'IMAGE' | 'BUTTON' | 'AD_CODE' | 'HERO';

interface SectionEditorProps {
  sections: CmsSectionInput[];
  onChange: (sections: CmsSectionInput[]) => void;
}

const SECTION_TYPES: SectionType[] = ['TEXT', 'IMAGE', 'BUTTON', 'AD_CODE', 'HERO'];

function emptySection(type: SectionType): CmsSectionInput {
  return {
    sort_order: 0,
    type,
    content: null,
    image_url: null,
    image_alt: null,
    button_text: null,
    button_link: null,
    html: null,
  };
}

export function SectionEditor({ sections, onChange }: SectionEditorProps) {
  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    onChange(reordered.map((s, i) => ({ ...s, sort_order: i })));
  }

  function addSection(type: SectionType) {
    onChange([...sections, { ...emptySection(type), sort_order: sections.length }]);
  }

  function updateSection(index: number, updated: CmsSectionInput) {
    const next = [...sections];
    next[index] = updated;
    onChange(next);
  }

  function deleteSection(index: number) {
    onChange(sections.filter((_, i) => i !== index).map((s, i) => ({ ...s, sort_order: i })));
  }

  return (
    <div className="space-y-3">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
              {sections.map((section, index) => (
                <Draggable key={index} draggableId={String(index)} index={index}>
                  {(provided, snapshot) => (
                    <SectionCard
                      section={section}
                      provided={provided}
                      isDragging={snapshot.isDragging}
                      onChange={(updated) => updateSection(index, updated)}
                      onDelete={() => deleteSection(index)}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="border border-dashed border-[hsl(var(--border))] rounded-lg p-4">
        <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-2 uppercase tracking-wide">
          Add section
        </p>
        <div className="flex flex-wrap gap-2">
          {SECTION_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addSection(type)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              {type}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
