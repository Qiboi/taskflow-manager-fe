
import { apiClient } from './axiosClient';
import type { CreateProjectPayload, Project, UpdateProjectPayload } from '../types/project';

export async function fetchProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<Project[]>('/projects');
  return data;
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  const { data } = await apiClient.post<Project>('/projects', payload);
  return data;
}

export async function updateProject(payload: UpdateProjectPayload): Promise<Project> {
  const { id, ...changes } = payload;
  const { data } = await apiClient.patch<Project>(`/projects/${id}`, changes);
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}
