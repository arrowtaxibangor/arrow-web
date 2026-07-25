import Link from 'next/link';
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  href?: string;
  className?: string;
}

export function StatsCard({ title, value, description, icon, href, className }: StatsCardProps) {
  const inner = (
    <Card className={cn('hover:shadow-md transition-shadow', href && 'cursor-pointer', className)}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{title}</p>
            <p className="text-3xl font-bold text-[hsl(var(--foreground))] mt-1">{value}</p>
            {description && (
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{description}</p>
            )}
          </div>
          {icon && <div className="text-[hsl(var(--muted-foreground))]">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
