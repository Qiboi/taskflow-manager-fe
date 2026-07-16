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
    <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-white shadow-lg">
      <span className="text-sm font-medium">{selectedCount} tugas dipilih</span>
      <div className="flex items-center gap-2">
        <button
          onClick={onComplete}
          disabled={isProcessing}
          className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-medium hover:bg-emerald-600 disabled:opacity-60"
        >
          Tandai Selesai
        </button>
        <button
          onClick={onDelete}
          disabled={isProcessing}
          className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium hover:bg-red-600 disabled:opacity-60"
        >
          Hapus
        </button>
        <button
          onClick={onClear}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
        >
          Batal Pilih
        </button>
      </div>
    </div>
  );
}
