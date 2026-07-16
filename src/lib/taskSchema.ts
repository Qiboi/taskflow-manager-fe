import { z } from 'zod';

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(120, 'Judul maksimal 120 karakter'),
  description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
