'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: 'destructive' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  variant = 'destructive',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      {/* DialogContent is portalled outside `.admin-root`, so its `bg-background`
          (hsl var) falls back to the root `--background: #ffffff` raw hex —
          which isn't valid HSL — and renders transparent. Explicit bg + border
          fixes the unreadable overlap. */}
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-lg max-w-md p-6">
        <DialogHeader className="space-y-2 pr-6">
          <DialogTitle className="text-lg font-semibold text-slate-900">{title}</DialogTitle>
          <DialogDescription className="text-sm text-slate-600">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2 flex-row justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
