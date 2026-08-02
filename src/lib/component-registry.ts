import type { SectionType } from './supabase/cms';

export type SectionFieldDef = {
  key: string;
  label: string;
  kind: 'richtext' | 'image' | 'text' | 'url' | 'html' | 'button-variant';
};

export type SectionTypeDef = {
  type: SectionType;
  label: string;
  description: string;
  fields: SectionFieldDef[];
};

export const SECTION_REGISTRY: SectionTypeDef[] = [
  {
    type: 'TEXT',
    label: 'Text Block',
    description: 'Rich-text content block with headings, lists and inline formatting.',
    fields: [{ key: 'content', label: 'Content', kind: 'richtext' }],
  },
  {
    type: 'IMAGE',
    label: 'Image',
    description: 'Full-width image with optional alt text.',
    fields: [
      { key: 'image_url', label: 'Image', kind: 'image' },
      { key: 'image_alt', label: 'Alt text', kind: 'text' },
    ],
  },
  {
    type: 'BUTTON',
    label: 'Button / CTA',
    description: 'Booking or action button linked to a named variant from Site Settings.',
    fields: [
      { key: 'button_text', label: 'Button text', kind: 'text' },
      { key: 'button_link', label: 'Button URL', kind: 'url' },
      { key: 'button_variant_slug', label: 'Button variant', kind: 'button-variant' },
    ],
  },
  {
    type: 'HERO',
    label: 'Hero Code',
    description: 'Raw HTML hero block. Admin-authored only — dangerouslySetInnerHTML accepted.',
    fields: [{ key: 'html', label: 'HTML', kind: 'html' }],
  },
  {
    type: 'AD_CODE',
    label: 'Ad / Embed Code',
    description: 'Raw HTML ad or embed block. Admin-authored only.',
    fields: [{ key: 'html', label: 'HTML', kind: 'html' }],
  },
];

export const SECTION_TYPE_LABELS: Record<SectionType, string> = Object.fromEntries(
  SECTION_REGISTRY.map((s) => [s.type, s.label])
) as Record<SectionType, string>;
