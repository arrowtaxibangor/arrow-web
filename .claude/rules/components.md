# Component rules

## Client vs server

Add `'use client'` at the top of any component file that uses:
- React hooks (`useState`, `useEffect`, `useRef`, etc.)
- Browser APIs (`window`, `document`, `localStorage`)
- Event handlers (`onClick`, `onChange`, etc.)
- React Query or Zustand

Omit `'use client'` only on pure server components that fetch data and render static JSX.

## Two component libraries — do not cross-use them

| Area | Library |
|------|---------|
| Public site (booking forms, homepage, footer) | Ant Design 5 |
| Admin dashboard (`src/components/admin/`, `src/app/admin/`) | shadcn/ui (Radix + Tailwind) |

Do not import Ant Design components into the admin area, and do not import shadcn/ui into public-facing pages.

## Exports

Named exports only. The pattern:

```ts
// correct
export function MyComponent() { ... }

// wrong — only for Next.js page/layout/error files
export default function MyComponent() { ... }
```

## Styling

Use Tailwind classes. The project has custom breakpoints — all `max-width` based:

| Token | Breakpoint |
|-------|-----------|
| `mobile` | max 575px |
| `mobilelg` | max 650px |
| `tablet` | max 768px |
| `tabletlg` | max 992px |
| `desktop` | max 1200px |

Use the `primary_color` Tailwind token for the brand blue. Do not hardcode `#265EA6` inline.
The accent yellow `#FEC601` has no token — inline use only where needed.

## Images

Do not use Next.js `<Image>` for Cloudinary-uploaded assets. `images.arrow.taxi` is not in
`next.config.mjs` `remotePatterns`. Use a plain `<img>` tag with the ESLint disable comment
(already established in `ImageField.tsx`):

```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={url} alt={alt} />
```

## Admin ImageField

Always use `<ImageField>` from `src/components/admin/ui/ImageField.tsx` for image inputs in
admin forms. It handles file upload, URL paste, preview, and clearing. Do not build bespoke
image inputs.

## Types

No `any`. Use `unknown` and narrow with a type guard, or define a proper interface. Prefer
explicit return types on all exported component functions and hooks.
