import { Button } from '@/components/ui/button';
import { CheckCheck, Trash2, X } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onComplete: () => void;
  onDelete: () => void;
  onClear: () => void;
  isProcessing: boolean;
}

export function BulkActionsBar({
  selectedCount,
  onComplete,
  onDelete,
  onClear,
  isProcessing,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg bg-foreground px-4 py-3 text-background shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-full bg-background/15 text-xs font-semibold">
          {selectedCount}
        </span>
        <span className="text-sm font-medium">tugas dipilih</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" onClick={onComplete} disabled={isProcessing}>
          <CheckCheck className="size-4" />
          Tandai Selesai
        </Button>
        <Button size="sm" variant="destructive" onClick={onDelete} disabled={isProcessing}>
          <Trash2 className="size-4" />
          Hapus
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClear}
          className="text-background hover:bg-background/10 hover:text-background"
        >
          <X className="size-4" />
          Batal Pilih
        </Button>
      </div>
    </div>
  );
}