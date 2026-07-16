import type { Task } from '../../types/task';
import { TaskItem } from './TaskItem';
import { useSelectionStore } from '../../store/selectionStore';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskList({ tasks, onToggleComplete, onEdit, onDelete }: TaskListProps) {
  const { selectedIds, toggle, selectMany, clear } = useSelectionStore();

  const visibleIds = tasks.map((t) => t.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const someVisibleSelected = visibleIds.some((id) => selectedIds.has(id));

  const handleSelectAllToggle = () => {
    if (allVisibleSelected) {
      clear();
    } else {
      // "Select all" hanya memilih tugas yang SEDANG TAMPIL sesuai filter aktif,
      // bukan seluruh data di database.
      selectMany(visibleIds);
    }
  };

  if (tasks.length === 0) {
    return <p className="mt-6 text-center text-sm text-slate-400">Tidak ada tugas yang cocok.</p>;
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 px-1">
        <input
          type="checkbox"
          checked={allVisibleSelected}
          ref={(el) => {
            if (el) el.indeterminate = !allVisibleSelected && someVisibleSelected;
          }}
          onChange={handleSelectAllToggle}
          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          aria-label="Pilih semua tugas yang tampil"
        />
        <span className="text-xs text-slate-500">
          Pilih semua ({tasks.length} tugas tampil)
        </span>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isSelected={selectedIds.has(task.id)}
            onToggleSelect={toggle}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}
