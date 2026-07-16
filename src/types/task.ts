export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskDifficulty = 'easy' | 'medium' | 'hard';

export interface Task {
  id: string;
  title: string;
  description?: string;
  /**
   * Turunan otomatis dari `status === 'completed'`. Dipertahankan supaya
   * filter Semua/Selesai/Belum Selesai (Requirement Fitur C) tetap jalan
   * tanpa perubahan. Selalu disinkronkan oleh localDb setiap kali `status`
   * atau `completed` diubah — jangan set field ini manual dari UI.
   */
  completed: boolean;
  status: TaskStatus;
  /** Format 'YYYY-MM-DD', atau null kalau tidak diset. */
  dueDate: string | null;
  priority: TaskPriority;
  difficulty: TaskDifficulty;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskFilterStatus = 'all' | 'completed' | 'active';

export interface CreateTaskPayload {
  title: string;
  description?: string;
  projectId?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
  priority?: TaskPriority;
  difficulty?: TaskDifficulty;
}

export interface UpdateTaskPayload {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
  status?: TaskStatus;
  dueDate?: string | null;
  priority?: TaskPriority;
  difficulty?: TaskDifficulty;
  projectId?: string | null;
}

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'Belum Dikerjakan',
  in_progress: 'Sedang Dikerjakan',
  completed: 'Selesai',
};

export const TASK_STATUS_ORDER: TaskStatus[] = ['todo', 'in_progress', 'completed'];

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const TASK_PRIORITY_ORDER: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

export const TASK_DIFFICULTY_LABEL: Record<TaskDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export const TASK_DIFFICULTY_ORDER: TaskDifficulty[] = ['easy', 'medium', 'hard'];