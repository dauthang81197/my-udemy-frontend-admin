export type LessonType = 'VIDEO' | 'FILE' | 'QUIZ' | 'ARTICLE';
export type LessonStatus = 'DRAFT' | 'PUBLISHED';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  videoUrl: string;
  isPreview: boolean;
  sortOrder: number;
  status: LessonStatus;
}

export interface CreateLessonRequest {
  sectionId: string;
  title: string;
  description?: string;
  type?: LessonType;
  videoUrl?: string;
  isPreview?: boolean;
  sortOrder?: number;
}

export interface UpdateLessonRequest {
  title: string;
  description?: string;
  type?: LessonType;
  videoUrl?: string;
  isPreview?: boolean;
  sortOrder?: number;
}
