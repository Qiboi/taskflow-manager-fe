export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskFilterStatus = 'all' | 'completed' | 'active';

export interface CreateTaskPayload {
  title: string;
  description?: string;
  projectId?: string | null;
}

export interface UpdateTaskPayload {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
  projectId?: string | null;
}
