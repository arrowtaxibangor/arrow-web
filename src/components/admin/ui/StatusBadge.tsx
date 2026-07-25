import { Badge } from '@/components/ui/badge';

export function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>
  ) : (
    <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100">
      Draft
    </Badge>
  );
}
