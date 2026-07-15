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

            const optimisticTask: Task = {
                id: `temp-${Date.now()}`,
                title: payload.title,
                description: payload.description,
                completed: false,
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
                (old ?? []).map((t) => (t.id === payload.id ? { ...t, ...payload } : t))
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
                (old ?? []).map((t) => (idSet.has(t.id) ? { ...t, ...changes } : t))
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

export function useFilteredTasks(tasks: Task[] | undefined, status: string, keyword: string) {
    if (!tasks) return [];
    return tasks.filter((t) => {
        const matchesStatus =
            status === 'all' ? true : status === 'completed' ? t.completed : !t.completed;
        const matchesKeyword = t.title.toLowerCase().includes(keyword.toLowerCase());
        return matchesStatus && matchesKeyword;
    });
}
