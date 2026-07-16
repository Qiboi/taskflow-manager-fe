import type { Task } from '@/types/task';
import { TaskItem } from '@/components/tasks/TaskItem';
import { useSelectionStore } from '@/store/selectionStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Minus, Inbox } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onCycleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskList({ tasks, onCycleStatus, onEdit, onDelete }: TaskListProps) {
  const { selectedIds, toggle, selectMany, clear } = useSelectionStore();

  const visibleIds = tasks.map((t) => t.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const someVisibleSelected = visibleIds.some((id) => selectedIds.has(id));
  const isPartiallySelected = someVisibleSelected && !allVisibleSelected;

  const handleSelectAllToggle = () => {
    if (allVisibleSelected || isPartiallySelected) {
      clear();
    } else {
      // "Select all" hanya memilih tugas yang SEDANG TAMPIL sesuai filter aktif,
      // bukan seluruh data di database.
      selectMany(visibleIds);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center gap-2 text-center">
        <Inbox className="size-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">Tidak ada tugas yang cocok.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
        {/*
          Base UI Checkbox (dipakai shadcn saat ini) belum punya state "indeterminate"
          seperti Radix. Jadi untuk kondisi "sebagian tugas terpilih", kita render tombol
          kustom kecil (ikon minus) alih-alih mengandalkan prop checked="indeterminate".
        */}
        {isPartiallySelected ? (
          <button
            type="button"
            onClick={handleSelectAllToggle}
            className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-primary bg-primary text-primary-foreground"
            aria-label="Sebagian tugas terpilih — klik untuk pilih semua"
          >
            <Minus className="size-3" />
          </button>
        ) : (
          <Checkbox
            checked={allVisibleSelected}
            onCheckedChange={handleSelectAllToggle}
            aria-label="Pilih semua tugas yang tampil"
          />
        )}
        <span className="text-xs font-medium text-muted-foreground">
          Pilih semua <span className="text-foreground">({tasks.length} tugas tampil)</span>
        </span>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isSelected={selectedIds.has(task.id)}
            onToggleSelect={toggle}
            onCycleStatus={onCycleStatus}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}