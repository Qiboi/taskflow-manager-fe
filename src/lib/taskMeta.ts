import type { Task, TaskStatus, TaskPriority, TaskDifficulty } from '../types/task';

/** Urutan siklus saat badge status diklik: todo -> in_progress -> completed -> todo. */
export function nextStatus(current: TaskStatus): TaskStatus {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'completed';
    return 'todo';
}

export function statusColorClass(status: TaskStatus): string {
    switch (status) {
        case 'todo':
            return 'bg-slate-100 text-slate-600';
        case 'in_progress':
            return 'bg-amber-100 text-amber-700';
        case 'completed':
            return 'bg-emerald-100 text-emerald-700';
    }
}

export function priorityColorClass(priority: TaskPriority): string {
    switch (priority) {
        case 'low':
            return 'bg-slate-100 text-slate-500';
        case 'medium':
            return 'bg-blue-100 text-blue-700';
        case 'high':
            return 'bg-orange-100 text-orange-700';
        case 'urgent':
            return 'bg-red-100 text-red-700';
    }
}

export function difficultyColorClass(difficulty: TaskDifficulty): string {
    switch (difficulty) {
        case 'easy':
            return 'bg-emerald-50 text-emerald-600';
        case 'medium':
            return 'bg-amber-50 text-amber-600';
        case 'hard':
            return 'bg-red-50 text-red-600';
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