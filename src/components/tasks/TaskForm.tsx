import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useMemo } from 'react';
import type { Task } from '@/types/task';
import type { Project } from '@/types/project';
import {
  TASK_STATUS_LABEL,
  TASK_STATUS_ORDER,
  TASK_PRIORITY_LABEL,
  TASK_PRIORITY_ORDER,
  TASK_DIFFICULTY_LABEL,
  TASK_DIFFICULTY_ORDER,
} from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

const NO_PROJECT_VALUE = '__none__';

function buildDefaultValues(
  initialTask: Task | null | undefined,
  defaultProjectId: string | null
): TaskFormValues {
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
    control,
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

  // Base UI Select butuh prop `items` di root supaya trigger menampilkan LABEL yang benar,
  // bukan raw value (beda dari Radix yang otomatis membaca children SelectItem aktif).
  const statusItems = useMemo(
    () => TASK_STATUS_ORDER.map((s) => ({ value: s, label: TASK_STATUS_LABEL[s] })),
    []
  );
  const priorityItems = useMemo(
    () => TASK_PRIORITY_ORDER.map((p) => ({ value: p, label: TASK_PRIORITY_LABEL[p] })),
    []
  );
  const difficultyItems = useMemo(
    () => TASK_DIFFICULTY_ORDER.map((d) => ({ value: d, label: TASK_DIFFICULTY_LABEL[d] })),
    []
  );
  const projectItems = useMemo(
    () => [
      { value: NO_PROJECT_VALUE, label: 'Tanpa Project' },
      ...projects.map((p) => ({ value: p.id, label: p.name })),
    ],
    [projects]
  );

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialTask ? 'Edit Tugas' : 'Tugas Baru'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" autoFocus placeholder="Mis. Tulis laporan mingguan" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">
              Deskripsi <span className="text-muted-foreground">(opsional)</span>
            </Label>
            <Textarea id="description" rows={3} placeholder="Detail tambahan..." {...register('description')} />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select items={statusItems} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dueDate">
                Due Date <span className="text-muted-foreground">(opsional)</span>
              </Label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate', { setValueAs: (v) => (v === '' ? null : v) })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select items={priorityItems} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Difficulty</Label>
              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <Select items={difficultyItems} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Project</Label>
            <Controller
              control={control}
              name="projectId"
              render={({ field }) => (
                <Select
                  items={projectItems}
                  value={field.value ?? NO_PROJECT_VALUE}
                  onValueChange={(v) => field.onChange(v === NO_PROJECT_VALUE ? null : v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : initialTask ? 'Simpan Perubahan' : 'Tambah Tugas'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}