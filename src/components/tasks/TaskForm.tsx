import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import type { Task } from '../../types/task';
import type { Project } from '../../types/project';
import {
  TASK_STATUS_LABEL,
  TASK_STATUS_ORDER,
  TASK_PRIORITY_LABEL,
  TASK_PRIORITY_ORDER,
  TASK_DIFFICULTY_LABEL,
  TASK_DIFFICULTY_ORDER,
} from '../../types/task';

const taskSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(120, 'Judul maksimal 120 karakter'),
  description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
  projectId: z.string().nullable(),
  status: z.enum(['todo', 'in_progress', 'completed']),
  dueDate: z.string().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialTask?: Task | null;
  projects: Project[];
  /** Project yang sedang aktif di sidebar, dipakai sebagai default saat tambah tugas baru. */
  defaultProjectId?: string | null;
  isSubmitting: boolean;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}

function buildDefaultValues(initialTask: Task | null | undefined, defaultProjectId: string | null): TaskFormValues {
  return {
    title: initialTask?.title ?? '',
    description: initialTask?.description ?? '',
    projectId: initialTask ? initialTask.projectId : defaultProjectId,
    status: initialTask?.status ?? 'todo',
    dueDate: initialTask?.dueDate ?? null,
    priority: initialTask?.priority ?? 'medium',
    difficulty: initialTask?.difficulty ?? 'medium',
  };
}

export function TaskForm({
  initialTask,
  projects,
  defaultProjectId = null,
  isSubmitting,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: buildDefaultValues(initialTask, defaultProjectId),
  });

  // Reset form values kalau initialTask berubah (mis. buka modal edit tugas berbeda)
  useEffect(() => {
    reset(buildDefaultValues(initialTask, defaultProjectId));
  }, [initialTask, defaultProjectId, reset]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {initialTask ? 'Edit Tugas' : 'Tugas Baru'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Judul</label>
            <input
              {...register('title')}
              type="text"
              autoFocus
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Mis. Tulis laporan mingguan"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Deskripsi <span className="text-slate-400">(opsional)</span>
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Detail tambahan..."
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
              <select
                {...register('status')}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {TASK_STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {TASK_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Due Date <span className="text-slate-400">(opsional)</span>
              </label>
              <input
                {...register('dueDate', { setValueAs: (v) => (v === '' ? null : v) })}
                type="date"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
              <select
                {...register('priority')}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {TASK_PRIORITY_ORDER.map((p) => (
                  <option key={p} value={p}>
                    {TASK_PRIORITY_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Difficulty</label>
              <select
                {...register('difficulty')}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {TASK_DIFFICULTY_ORDER.map((d) => (
                  <option key={d} value={d}>
                    {TASK_DIFFICULTY_LABEL[d]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Project</label>
            <select
              {...register('projectId', { setValueAs: (v) => (v === '' ? null : v) })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">Tanpa Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Menyimpan...' : initialTask ? 'Simpan Perubahan' : 'Tambah Tugas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}