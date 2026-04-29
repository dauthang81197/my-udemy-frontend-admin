import axiosInstance from './axiosInstance';
import { env } from '@/config/env';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import type { Section, CreateSectionRequest, UpdateSectionRequest } from '@/types/section.types';

const BASE = `${env.courseServicePrefix}/admin/sections`;

export const sectionApi = {
  getAll: (params?: PaginationParams) =>
    axiosInstance.get<PaginatedResponse<Section>>(BASE, { params }),

  getById: (id: string) =>
    axiosInstance.get<ApiResponse<Section>>(`${BASE}:id`, { params: { id } }),

  create: (data: CreateSectionRequest) =>
    axiosInstance.post<ApiResponse<Section>>(BASE, data),

  update: (id: string, data: UpdateSectionRequest) =>
    axiosInstance.put<ApiResponse<Section>>(`${BASE}:id`, data, { params: { id } }),

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<Section>>(`${BASE}:id`, { params: { id } }),
};
