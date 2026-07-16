import type { Task } from '../../types/task';
import { TASK_STATUS_LABEL, TASK_PRIORITY_LABEL, TASK_DIFFICULTY_LABEL } from '../../types/task';
import {
  statusColorClass,
  priorityColorClass,
  difficultyColorClass,
  isOverdue,
  formatDueDate,
} from '../../lib/taskMeta';

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onCycleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({
  task,
  isSelected,
  onToggleSelect,
  onCycleStatus,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const overdue = isOverdue(task);

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

      <div className="min-w-0 flex-1">
        <p className={task.status === 'completed' ? 'truncate text-slate-400 line-through' : 'truncate text-slate-900'}>
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 truncate text-xs text-slate-400">{task.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onCycleStatus(task)}
            className={
              'rounded-full px-2 py-0.5 text-xs font-medium transition hover:opacity-80 ' +
              statusColorClass(task.status)
            }
            title="Klik untuk ganti status"
          >
            {TASK_STATUS_LABEL[task.status]}
          </button>

          <span className={'rounded-full px-2 py-0.5 text-xs font-medium ' + priorityColorClass(task.priority)}>
            {TASK_PRIORITY_LABEL[task.priority]}
          </span>

          <span className={'rounded-full px-2 py-0.5 text-xs font-medium ' + difficultyColorClass(task.difficulty)}>
            {TASK_DIFFICULTY_LABEL[task.difficulty]}
          </span>

          {task.dueDate && (
            <span
              className={
                'rounded-full px-2 py-0.5 text-xs font-medium ' +
                (overdue ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500')
              }
            >
              {overdue ? '⚠ ' : ''}
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
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