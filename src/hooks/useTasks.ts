import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  bulkDeleteTasks,
  bulkUpdateTasks,
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from '../api/tasksApi';
import type { CreateTaskPayload, Task, UpdateTaskPayload } from '../types/task';

export const TASKS_QUERY_KEY = ['tasks'] as const;

export function useTasksQuery() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: fetchTasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      const status = payload.status ?? 'todo';
      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        title: payload.title,
        description: payload.description,
        completed: status === 'completed',
        status,
        dueDate: payload.dueDate ?? null,
        priority: payload.priority ?? 'medium',
        difficulty: payload.difficulty ?? 'medium',
        projectId: payload.projectId ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) => [
        optimisticTask,
        ...(old ?? []),
      ]);

      return { previousTasks };
    },
    onError: (_err, _payload, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTaskPayload) => updateTask(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) =>
        (old ?? []).map((t) => {
          if (t.id !== payload.id) return t;
          const merged = { ...t, ...payload };
          // Jaga konsistensi optimistic UI: kalau status diubah, completed ikut
          // disesuaikan sebelum data asli dari server datang (invalidate).
          if (payload.status !== undefined) {
            merged.completed = payload.status === 'completed';
          }
          return merged;
        })
      );

      return { previousTasks };
    },
    onError: (_err, _payload, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) =>
        (old ?? []).filter((t) => t.id !== id)
      );

      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useBulkUpdateTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, changes }: { ids: string[]; changes: Partial<Task> }) =>
      bulkUpdateTasks(ids, changes),
    onMutate: async ({ ids, changes }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);
      const idSet = new Set(ids);

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) =>
        (old ?? []).map((t) => {
          if (!idSet.has(t.id)) return t;
          const merged = { ...t, ...changes };
          if (changes.status !== undefined) {
            merged.completed = changes.status === 'completed';
          }
          return merged;
        })
      );

      return { previousTasks };
    },
    onError: (_err, _payload, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useBulkDeleteTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteTasks(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);
      const idSet = new Set(ids);

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) =>
        (old ?? []).filter((t) => !idSet.has(t.id))
      );

      return { previousTasks };
    },
    onError: (_err, _ids, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

/**
 * Hook turunan: menerapkan filter status + kata kunci pencarian + project aktif
 * pada hasil query tasks. Dipakai oleh komponen daftar tugas.
 * `projectId === null` berarti "All Projects" (tidak difilter berdasarkan project).
 */
export function useFilteredTasks(
  tasks: Task[] | undefined,
  status: string,
  keyword: string,
  projectId?: string | null
) {
  if (!tasks) return [];
  return tasks.filter((t) => {
    const matchesStatus =
      status === 'all' ? true : status === 'completed' ? t.completed : !t.completed;
    const matchesKeyword = t.title.toLowerCase().includes(keyword.toLowerCase());
    const matchesProject = projectId === null || projectId === undefined || t.projectId === projectId;
    return matchesStatus && matchesKeyword && matchesProject;
  });
}