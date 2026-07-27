'use client';

const PALETTE = ['#265EA6', '#e11d48', '#4338ca', '#475569'];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<AvatarSize, { px: number; text: string }> = {
  sm: { px: 28, text: 'text-[10px]' },
  md: { px: 40, text: 'text-[13px]' },
  lg: { px: 42, text: 'text-[14px]' },
  xl: { px: 44, text: 'text-[15px]' },
};

export function Avatar({ name, size = 'sm' }: { name: string; size?: AvatarSize }) {
  const { px, text } = SIZE_MAP[size];
  return (
    <div
      style={{ width: px, height: px, backgroundColor: getColor(name), flexShrink: 0 }}
      className={`rounded-full flex items-center justify-center font-mono font-semibold text-white ${text}`}
    >
      {getInitials(name)}
    </div>
  );
}
