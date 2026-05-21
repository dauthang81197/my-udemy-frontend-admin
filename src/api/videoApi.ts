import axios from "axios";
import axiosInstance from "./axiosInstance";
import { env } from "@/config/env";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api.types";
import type { VideoFile } from "@/types/video.types";

const BASE = `${env.courseServicePrefix}/admin/videos`;
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB - S3 minimum part size

interface InitiateResponse {
  key: string;
  uploadId: string;
}

interface PartInfo {
  partNumber: number;
  eTag: string;
}

interface CompleteUploadRequest {
  key: string;
  uploadId: string;
  nameSection: string;
  originalFilename: string;
  contentType: string;
  fileSize: number;
  parts: PartInfo[];
}

// Plain axios for direct S3 uploads — no auth headers, no timeout
const s3Axios = axios.create({ timeout: 0 });

async function uploadFileWithMultipart(
  file: File,
  nameSection: string,
  onProgress?: (percent: number) => void,
): Promise<VideoFile> {
  console.log("File:", {
    name: file.name,
    size: file.size,
    type: file.type,
  });
  const initiateRes = await axiosInstance.post<ApiResponse<InitiateResponse>>(
    `${BASE}/initiate`,
    null,
    { params: { filename: file.name } },
  );
  const { key, uploadId } = initiateRes.data.data;

  const totalParts = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
  const parts: PartInfo[] = [];

  for (let i = 0; i < totalParts; i++) {
    const partNumber = i + 1;
    const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    console.log(`Part ${partNumber}: chunk size = ${chunk.size} bytes`);
    const presignRes = await axiosInstance.get<ApiResponse<{ url: string }>>(
      `${BASE}/presign`,
      { params: { key, uploadId, partNumber } },
    );
    const presignedUrl = presignRes.data.data.url;

    const putRes = await s3Axios.put(presignedUrl, chunk, {
      headers: { "Content-Type": file.type },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          const overall = ((i + event.loaded / event.total) / totalParts) * 100;
          onProgress(Math.round(overall));
        }
      },
    });

    const eTag = putRes.headers["etag"] ?? putRes.headers["ETag"];
    if (!eTag) {
      throw new Error(
        `ETag is null for part ${partNumber}. Ensure CORS ExposeHeaders includes ETag on the R2 bucket.`,
      );
    }
    parts.push({ partNumber, eTag: eTag as string });
  }

  const body: CompleteUploadRequest = {
    key,
    uploadId,
    nameSection,
    originalFilename: file.name,
    contentType: file.type,
    fileSize: file.size,
    parts,
  };
  console.log("Parts to send:", JSON.stringify(parts, null, 2));
  const completeRes = await axiosInstance.post<ApiResponse<VideoFile>>(
    `${BASE}/complete`,
    body,
  );

  return completeRes.data.data;
}

export const videoApi = {
  getAll: (params?: PaginationParams) =>
    axiosInstance.get<PaginatedResponse<VideoFile>>(BASE, { params }),

  getById: (id: string) =>
    axiosInstance.get<ApiResponse<VideoFile>>(`${BASE}/${id}`),

  upload: (
    file: File,
    nameSection: string,
    onProgress?: (percent: number) => void,
  ) => uploadFileWithMultipart(file, nameSection, onProgress),

  uploadMultiple: async (
    files: File[],
    nameSection: string,
    onProgress?: (percent: number) => void,
  ): Promise<VideoFile[]> => {
    const results: VideoFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const result = await uploadFileWithMultipart(
        files[i],
        nameSection,
        onProgress
          ? (percent) => {
              onProgress(
                Math.round(((i + percent / 100) / files.length) * 100),
              );
            }
          : undefined,
      );
      results.push(result);
    }
    return results;
  },

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<VideoFile>>(`${BASE}/${id}`),
};
