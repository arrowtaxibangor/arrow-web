const GRADIENTS: Record<string, string> = {
  'Local Guide': 'linear-gradient(135deg, #93c5fd 0%, #1d4ed8 100%)',
  'Airport Tips': 'linear-gradient(135deg, #60a5fa 0%, #265EA6 100%)',
  Snowdonia: 'linear-gradient(135deg, #6ee7b7 0%, #065f46 100%)',
  News: 'linear-gradient(135deg, #94a3b8 0%, #1e293b 100%)',
  'Travel Tips': 'linear-gradient(135deg, #fde68a 0%, #d97706 100%)',
};

type PostCoverProps = {
  imageUrl?: string | null;
  category?: string | null;
  alt?: string;
  minHeight?: number;
};

export function PostCover({ imageUrl, category, alt = '', minHeight }: PostCoverProps) {
  const gradient = GRADIENTS[category ?? ''] ?? 'linear-gradient(135deg, #93c5fd 0%, #265EA6 100%)';

  if (minHeight) {
    return (
      <div className="relative w-full h-full overflow-hidden" style={{ minHeight }}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: gradient }} />
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0" style={{ background: gradient }} />
      )}
    </div>
  );
}
