import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
