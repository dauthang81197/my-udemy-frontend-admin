import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { sectionApi } from '@/api/sectionApi';
import { getApiErrorMessage } from '@/utils/helpers';
import { SECTIONS_QUERY_KEY } from './useSections';
import type { Section } from '@/types/section.types';
import type { PaginatedResponse } from '@/types/api.types';

export function useDownloadSectionTemplate() {
  return useMutation({
    mutationFn: (courseId: string) => sectionApi.downloadTemplate(courseId),
    onSuccess: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'section_import_template.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}

export function useImportSections() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, file }: { courseId: string; file: File }) =>
      sectionApi.importSections(courseId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SECTIONS_QUERY_KEY] });
      message.success('Sections imported successfully');
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}

export function useCreateSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sectionApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SECTIONS_QUERY_KEY] });
      message.success('Section created');
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}

export function useUpdateSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof sectionApi.update>[1] }) =>
      sectionApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: [SECTIONS_QUERY_KEY] });
      const snapshots = qc.getQueriesData<PaginatedResponse<Section>>({ queryKey: [SECTIONS_QUERY_KEY] });
      snapshots.forEach(([key, old]) => {
        if (!old) return;
        qc.setQueryData<PaginatedResponse<Section>>(key, {
          ...old,
          data: old.data.map((s) => (s.id === id ? { ...s, ...data } : s)),
        });
      });
      return { snapshots };
    },
    onError: (err, _vars, ctx) => {
      ctx?.snapshots.forEach(([key, old]) => qc.setQueryData(key, old));
      message.error(getApiErrorMessage(err));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [SECTIONS_QUERY_KEY] }),
    onSuccess: () => message.success('Section updated'),
  });
}

export function useDeleteSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sectionApi.delete,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: [SECTIONS_QUERY_KEY] });
      const snapshots = qc.getQueriesData<PaginatedResponse<Section>>({ queryKey: [SECTIONS_QUERY_KEY] });
      snapshots.forEach(([key, old]) => {
        if (!old) return;
        qc.setQueryData<PaginatedResponse<Section>>(key, {
          ...old,
          data: old.data.filter((s) => s.id !== id),
          totalItems: old.totalItems - 1,
        });
      });
      return { snapshots };
    },
    onError: (err, _id, ctx) => {
      ctx?.snapshots.forEach(([key, old]) => qc.setQueryData(key, old));
      message.error(getApiErrorMessage(err));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [SECTIONS_QUERY_KEY] }),
    onSuccess: () => message.success('Section deleted'),
  });
}
