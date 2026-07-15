export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export type TaskFilterStatus = 'all' | 'completed' | 'active';
  
  export interface CreateTaskPayload {
    title: string;
    description?: string;
  }
  
  export interface UpdateTaskPayload {
    id: string;
    title?: string;
    description?: string;
    completed?: boolean;
  }
  