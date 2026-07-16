import type { Task } from '@/types/task';
import { TASK_STATUS_LABEL, TASK_PRIORITY_LABEL, TASK_DIFFICULTY_LABEL } from '@/types/task';
import {
  statusColorClass,
  priorityColorClass,
  difficultyColorClass,
  isOverdue,
  formatDueDate,
} from '@/lib/taskMeta';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Pencil, Trash2 } from 'lucide-react';

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
        'group flex items-start gap-3 rounded-lg border px-4 py-3 shadow-sm transition-colors ' +
        (isSelected ? 'border-primary/50 bg-primary/5' : 'border-border bg-card hover:bg-accent/40')
      }
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleSelect(task.id)}
        className="mt-1"
        aria-label={`Pilih tugas ${task.title}`}
      />

      <div className="min-w-0 flex-1 space-y-1.5">
        <div>
          <p
            className={
              task.status === 'completed'
                ? 'truncate text-sm text-muted-foreground line-through'
                : 'truncate text-sm font-medium text-foreground'
            }
          >
            {task.title}
          </p>
          {task.description && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{task.description}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            onClick={() => onCycleStatus(task)}
            className={'cursor-pointer select-none ' + statusColorClass(task.status)}
            title="Klik untuk ganti status"
          >
            {TASK_STATUS_LABEL[task.status]}
          </Badge>

          <Badge className={priorityColorClass(task.priority)}>
            {TASK_PRIORITY_LABEL[task.priority]}
          </Badge>

          <Badge className={difficultyColorClass(task.difficulty)}>
            {TASK_DIFFICULTY_LABEL[task.difficulty]}
          </Badge>

          {task.dueDate && (
            <Badge variant={overdue ? 'destructive' : 'secondary'} className="gap-1">
              {overdue && <AlertTriangle className="size-3" />}
              {formatDueDate(task.dueDate)}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(task)}
          aria-label={`Edit tugas ${task.title}`}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task)}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Hapus tugas ${task.title}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </li>
  );
}