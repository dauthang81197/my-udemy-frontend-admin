import axiosInstance from "./axiosInstance";
import { env } from "@/config/env";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api.types";
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "@/types/course.types";

const BASE = `${env.courseServicePrefix}/admin/courses`;

export const courseApi = {
  getAll: (params?: PaginationParams) =>
    axiosInstance.get<PaginatedResponse<Course>>(BASE, { params }),

  getById: (id: string) =>
    axiosInstance.get<ApiResponse<Course>>(`${BASE}/${id}`, {}),

  create: (data: CreateCourseRequest) =>
    axiosInstance.post<ApiResponse<Course>>(BASE, data),

  update: (id: string, data: UpdateCourseRequest) =>
    axiosInstance.put<ApiResponse<Course>>(`${BASE}/${id}`, data, {
      params: { id },
    }),

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<Course>>(`${BASE}/${id}`, {
      params: { id },
    }),

  publish: (id: string) =>
    axiosInstance.put<ApiResponse<Course>>(`${BASE}/${id}/published`, null, {}),
};
