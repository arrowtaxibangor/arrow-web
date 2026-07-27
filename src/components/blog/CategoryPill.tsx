const CATEGORY_STYLES: Record<string, string> = {
  'Local Guide': 'bg-blue-50 text-blue-800 border-blue-200',
  'Airport Tips': 'bg-sky-50 text-[#265EA6] border-sky-200',
  Snowdonia: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  News: 'bg-slate-50 text-slate-600 border-slate-200',
  'Travel Tips': 'bg-amber-50 text-amber-800 border-amber-200',
};

export function CategoryPill({ category }: { category: string }) {
  const style = CATEGORY_STYLES[category] ?? 'bg-gray-50 text-gray-600 border-gray-200';
  return (
    <span
      className={`inline-block font-mono text-[10px] uppercase tracking-[0.08em] px-[10px] py-[4px] rounded border ${style}`}
    >
      {category}
    </span>
  );
}
