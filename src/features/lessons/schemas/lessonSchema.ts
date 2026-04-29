import { z } from 'zod';

export const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  type: z.enum(['VIDEO', 'FILE', 'QUIZ', 'ARTICLE']).default('VIDEO'),
  videoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isPreview: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
  sectionId: z.string().min(1, 'Section is required'),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;
