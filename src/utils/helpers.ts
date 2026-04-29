import type { AxiosError } from 'axios';
import type { ApiError } from '@/types/api.types';

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  const axiosErr = error as AxiosError<ApiError>;
  return axiosErr?.response?.data?.message ?? fallback;
}

export function buildSortParam(field: string, order: 'asc' | 'desc' = 'asc'): string {
  return `${field},${order}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
