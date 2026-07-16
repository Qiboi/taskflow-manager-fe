import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import type { Project } from '../../types/project';
import { PROJECT_COLORS } from '../../types/project';

const projectSchema = z.object({
  name: z.string().min(1, 'Nama project wajib diisi').max(80, 'Maksimal 80 karakter'),
  clientName: z.string().max(80, 'Maksimal 80 karakter').optional(),
  color: z.string().min(1),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialProject?: Project | null;
  isSubmitting: boolean;
  onSubmit: (values: ProjectFormValues) => void;
  onCancel: () => void;
}

export function ProjectForm({ initialProject, isSubmitting, onSubmit, onCancel }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialProject?.name ?? '',
      clientName: initialProject?.clientName ?? '',
      color: initialProject?.color ?? PROJECT_COLORS[0],
    },
  });

  useEffect(() => {
    reset({
      name: initialProject?.name ?? '',
      clientName: initialProject?.clientName ?? '',
      color: initialProject?.color ?? PROJECT_COLORS[0],
    });
  }, [initialProject, reset]);

  const selectedColor = watch('color');

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {initialProject ? 'Edit Project' : 'Project Baru'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nama Project</label>
            <input
              {...register('name')}
              type="text"
              autoFocus
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Mis. Acme Corp Website"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nama Client <span className="text-slate-400">(opsional)</span>
            </label>
            <input
              {...register('clientName')}
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Mis. Acme Corp"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Warna</label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color, { shouldValidate: true })}
                  className={
                    'h-7 w-7 rounded-full ring-offset-2 transition ' +
                    (selectedColor === color ? 'ring-2 ring-slate-900' : 'hover:scale-105')
                  }
                  style={{ backgroundColor: color }}
                  aria-label={`Pilih warna ${color}`}
                />
              ))}
            </div>
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
              {isSubmitting ? 'Menyimpan...' : initialProject ? 'Simpan Perubahan' : 'Buat Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
