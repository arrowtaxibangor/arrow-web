'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import type { BlogCategory } from '@/lib/supabase/blog';

const CATEGORIES: BlogCategory[] = [
  'Local Guide',
  'Airport Tips',
  'Snowdonia',
  'News',
  'Travel Tips',
];

export function CategoryTabs({ active }: { active: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function select(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    router.push(`/blog?${params.toString()}`);
  }

  const tabs = ['All', ...CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((cat) => {
        const isActive = cat === 'All' ? active === 'All' : active === cat;
        return (
          <button
            key={cat}
            onClick={() => select(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isActive ? 'bg-[#265EA6] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
