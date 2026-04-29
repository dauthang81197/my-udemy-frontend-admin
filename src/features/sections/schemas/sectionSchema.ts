import { z } from 'zod';

export const sectionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  courseId: z.string().min(1, 'Course is required'),
});

export type SectionFormValues = z.infer<typeof sectionSchema>;
