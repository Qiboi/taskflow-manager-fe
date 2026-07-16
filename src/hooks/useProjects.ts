import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from '../api/projectsApi';
import { TASKS_QUERY_KEY } from '../hooks/useTasks';
import type { CreateProjectPayload, Project, UpdateProjectPayload } from '../types/project';

export const PROJECTS_QUERY_KEY = ['projects'] as const;

export function useProjectsQuery() {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: fetchProjects,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: PROJECTS_QUERY_KEY });
      const previousProjects = queryClient.getQueryData<Project[]>(PROJECTS_QUERY_KEY);

      const optimisticProject: Project = {
        id: `temp-${Date.now()}`,
        name: payload.name,
        color: payload.color,
        clientName: payload.clientName,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Project[]>(PROJECTS_QUERY_KEY, (old) => [
        optimisticProject,
        ...(old ?? []),
      ]);

      return { previousProjects };
    },
    onError: (_err, _payload, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(PROJECTS_QUERY_KEY, context.previousProjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProjectPayload) => updateProject(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: PROJECTS_QUERY_KEY });
      const previousProjects = queryClient.getQueryData<Project[]>(PROJECTS_QUERY_KEY);

      queryClient.setQueryData<Project[]>(PROJECTS_QUERY_KEY, (old) =>
        (old ?? []).map((p) => (p.id === payload.id ? { ...p, ...payload } : p))
      );

      return { previousProjects };
    },
    onError: (_err, _payload, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(PROJECTS_QUERY_KEY, context.previousProjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: PROJECTS_QUERY_KEY });
      const previousProjects = queryClient.getQueryData<Project[]>(PROJECTS_QUERY_KEY);

      queryClient.setQueryData<Project[]>(PROJECTS_QUERY_KEY, (old) =>
        (old ?? []).filter((p) => p.id !== id)
      );

      return { previousProjects };
    },
    onError: (_err, _id, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(PROJECTS_QUERY_KEY, context.previousProjects);
      }
    },
    onSettled: () => {
      // Menghapus project bisa melepas projectId beberapa tugas (jadi null di server),
      // jadi query tugas juga perlu di-refresh, bukan cuma query project.
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}
