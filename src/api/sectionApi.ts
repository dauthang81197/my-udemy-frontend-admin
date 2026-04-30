import axiosInstance from "./axiosInstance";
import { env } from "@/config/env";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api.types";
import type {
  Section,
  CreateSectionRequest,
  UpdateSectionRequest,
} from "@/types/section.types";

const BASE = `${env.courseServicePrefix}/admin/sections`;
const TEMPLATE_BASE = `${env.courseServicePrefix}/admin/templates/courses`;

export const sectionApi = {
  getAll: (params?: PaginationParams) =>
    axiosInstance.get<PaginatedResponse<Section>>(BASE, { params }),

  getById: (id: string) =>
    axiosInstance.get<ApiResponse<Section>>(`${BASE}:id`, { params: { id } }),

  create: (data: CreateSectionRequest) =>
    axiosInstance.post<ApiResponse<Section>>(BASE, data),

  update: (id: string, data: UpdateSectionRequest) =>
    axiosInstance.put<ApiResponse<Section>>(`${BASE}/${id}`, data),

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<Section>>(`${BASE}/${id}`),

  downloadTemplate: (courseId: string) =>
    axiosInstance.get<Blob>(`${TEMPLATE_BASE}/${courseId}/sections`, {
      responseType: "blob",
    }),

  importSections: (courseId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post<ApiResponse<Section[]>>(
      `${env.courseServicePrefix}/admin/sections/import`,
      formData,
      {
        params: { courseId },
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },
};
