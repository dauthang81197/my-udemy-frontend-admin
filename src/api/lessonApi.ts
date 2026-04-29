import axiosInstance from './axiosInstance';
import { env } from '@/config/env';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import type { Lesson, CreateLessonRequest, UpdateLessonRequest } from '@/types/lesson.types';

const BASE = `${env.courseServicePrefix}/admin/lessons`;

export const lessonApi = {
  getAll: (params?: PaginationParams) =>
    axiosInstance.get<PaginatedResponse<Lesson>>(BASE, { params }),

  getById: (id: string) =>
    axiosInstance.get<ApiResponse<Lesson>>(`${BASE}:id`, { params: { id } }),

  create: (data: CreateLessonRequest) =>
    axiosInstance.post<ApiResponse<Lesson>>(BASE, data),

  update: (id: string, data: UpdateLessonRequest) =>
    axiosInstance.put<ApiResponse<Lesson>>(`${BASE}:id`, data, { params: { id } }),

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<Lesson>>(`${BASE}:id`, { params: { id } }),
};
