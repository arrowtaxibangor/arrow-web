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
      router.push('/blog');
    } else {
      params.set('category', cat);
      router.push(`/blog?${params.toString()}`);
    }
  }

  const tabs = ['All', ...CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2 mb-12">
      {tabs.map((cat) => {
        const isActive = cat === 'All' ? active === 'All' : active === cat;
        return (
          <button
            key={cat}
            onClick={() => select(cat)}
            className={`px-4 py-1.5 rounded-full text-[14px] font-medium transition-colors border ${
              isActive
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
