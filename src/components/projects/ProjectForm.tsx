import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import type { Project } from '@/types/project';
import { PROJECT_COLORS } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialProject ? 'Edit Project' : 'Project Baru'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Project</Label>
            <Input id="name" autoFocus placeholder="Mis. Acme Corp Website" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="clientName">
              Nama Client <span className="text-muted-foreground">(opsional)</span>
            </Label>
            <Input id="clientName" placeholder="Mis. Acme Corp" {...register('clientName')} />
          </div>

          <div className="space-y-2">
            <Label>Warna</Label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color, { shouldValidate: true })}
                  className={
                    'size-7 rounded-full ring-offset-2 ring-offset-background transition ' +
                    (selectedColor === color ? 'ring-2 ring-foreground' : 'hover:scale-105')
                  }
                  style={{ backgroundColor: color }}
                  aria-label={`Pilih warna ${color}`}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : initialProject ? 'Simpan Perubahan' : 'Buat Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}