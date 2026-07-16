import type { Task, TaskStatus, TaskPriority, TaskDifficulty } from '@/types/task';

/** Urutan siklus saat badge status diklik: todo -> in_progress -> completed -> todo. */
export function nextStatus(current: TaskStatus): TaskStatus {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'completed';
    return 'todo';
}

export function statusColorClass(status: TaskStatus): string {
    switch (status) {
        case 'todo':
            return 'bg-muted text-muted-foreground hover:bg-muted';
        case 'in_progress':
            return 'bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400';
        case 'completed':
            return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400';
    }
}

export function priorityColorClass(priority: TaskPriority): string {
    switch (priority) {
        case 'low':
            return 'bg-muted text-muted-foreground';
        case 'medium':
            return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400';
        case 'high':
            return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400';
        case 'urgent':
            return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400';
    }
}

export function difficultyColorClass(difficulty: TaskDifficulty): string {
    switch (difficulty) {
        case 'easy':
            return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400';
        case 'medium':
            return 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400';
        case 'hard':
            return 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400';
    }
}

export function isOverdue(task: Pick<Task, 'dueDate' | 'status'>): boolean {
    if (!task.dueDate || task.status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    return due < today;
}

export function formatDueDate(dueDate: string): string {
    const date = new Date(dueDate);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}