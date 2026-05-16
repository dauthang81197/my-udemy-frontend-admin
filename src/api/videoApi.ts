import axiosInstance from "./axiosInstance";
import { env } from "@/config/env";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api.types";
import type { VideoFile } from "@/types/video.types";

const BASE = `${env.courseServicePrefix}/admin/videos`;

export const videoApi = {
  getAll: (params?: PaginationParams) =>
    axiosInstance.get<PaginatedResponse<VideoFile>>(BASE, { params }),

  getById: (id: string) =>
    axiosInstance.get<ApiResponse<VideoFile>>(`${BASE}/${id}`),

  upload: (
    name: string,
    file: File,
    onProgress?: (percent: number) => void,
  ) => {
    const formData = new FormData();
    formData.append("nameSection", name);
    formData.append("file", file);
    return axiosInstance.post<ApiResponse<VideoFile>>(
      `${BASE}/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (onProgress && event.total) {
            onProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      },
    );
  },

  uploadMultiple: (
    nameSection: string,
    files: File[],
    onProgress?: (percent: number) => void,
  ) => {
    const formData = new FormData();
    formData.append("nameSection", nameSection);
    files.forEach((file) => formData.append("files", file));
    return axiosInstance.post<ApiResponse<VideoFile[]>>(
      `${BASE}/upload-multiple`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (onProgress && event.total) {
            onProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      },
    );
  },

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<VideoFile>>(`${BASE}/${id}`),
};
