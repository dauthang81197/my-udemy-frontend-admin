export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type CourseStatus = 'DRAFT' | 'PUBLISHED';

export interface Course {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  status: CourseStatus;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  level: CourseLevel;
}

export interface UpdateCourseRequest {
  title: string;
  description: string;
  level: CourseLevel;
}
