import type { Task, CreateTaskPayload, UpdateTaskPayload } from "../types/task";
import { apiClient } from "./axiosClient";

export async function fetchTasks(): Promise<Task[]> {
  const { data } = await apiClient.get<Task[]>('/tasks');
  return data;
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await apiClient.post<Task>('/tasks', payload);
  return data;
}

export async function updateTask(payload: UpdateTaskPayload): Promise<Task> {
  const { id, ...changes } = payload;
  const { data } = await apiClient.patch<Task>(`/tasks/${id}`, changes);
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}

export async function bulkUpdateTasks(ids: string[], changes: Partial<Task>): Promise<Task[]> {
  const { data } = await apiClient.patch<Task[]>('/tasks/bulk', { ids, changes });
  return data;
}

export async function bulkDeleteTasks(ids: string[]): Promise<void> {
  await apiClient.delete('/tasks/bulk', { data: { ids } });
}
