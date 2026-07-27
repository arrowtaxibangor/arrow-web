# Skill: New admin UI component

Use this template when adding a new component to the admin dashboard. Copy and adapt.

Matches the style of `src/components/admin/ui/ImageField.tsx` and `src/components/admin/sections/SectionCard.tsx`.

## Template

```tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function MyComponent({ value, onChange, label }: MyComponentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong');
        return;
      }
      onChange(data.result);
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-xs font-medium text-gray-600">{label}</span>}

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="..."
        className="text-sm"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      <Button
        type="button"
        size="sm"
        disabled={loading}
        onClick={handleSubmit}
        className={cn('self-start', loading && 'opacity-60 cursor-wait')}
      >
        {loading ? 'Saving…' : 'Save'}
      </Button>
    </div>
  );
}
```

## Rules to remember
- Named export only — no `export default`
- `'use client'` at the top — admin components always use hooks
- Use shadcn/ui primitives (`Button`, `Input`) — not Ant Design
- Always show loading + error state for any async action
- Use `cn()` from `@/lib/utils` for conditional class merging
