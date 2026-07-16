import type { Task } from '../../types/task';

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({
  task,
  isSelected,
  onToggleSelect,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  return (
    <li
      className={
        'flex items-start gap-3 rounded-lg bg-white px-4 py-3 shadow-sm ring-1 transition ' +
        (isSelected ? 'ring-brand-400 bg-brand-50/40' : 'ring-slate-200')
      }
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggleSelect(task.id)}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        aria-label={`Pilih tugas ${task.title}`}
      />

      <button
        onClick={() => onToggleComplete(task)}
        className={
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ' +
          (task.completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 hover:border-brand-500')
        }
        aria-label={task.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
      >
        {task.completed && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className={task.completed ? 'truncate text-slate-400 line-through' : 'truncate text-slate-900'}>
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 truncate text-xs text-slate-400">{task.description}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => onEdit(task)}
          className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="rounded-md px-2 py-1 text-xs text-red-500 hover:bg-red-50"
        >
          Hapus
        </button>
      </div>
    </li>
  );
}
