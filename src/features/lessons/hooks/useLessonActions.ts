import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { lessonApi } from '@/api/lessonApi';
import { getApiErrorMessage } from '@/utils/helpers';
import { LESSONS_QUERY_KEY } from './useLessons';
import type { Lesson } from '@/types/lesson.types';
import type { PaginatedResponse } from '@/types/api.types';

export function useCreateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: lessonApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LESSONS_QUERY_KEY] });
      message.success('Lesson created');
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}

export function useUpdateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof lessonApi.update>[1] }) =>
      lessonApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: [LESSONS_QUERY_KEY] });
      const snapshots = qc.getQueriesData<PaginatedResponse<Lesson>>({ queryKey: [LESSONS_QUERY_KEY] });
      snapshots.forEach(([key, old]) => {
        if (!old) return;
        qc.setQueryData<PaginatedResponse<Lesson>>(key, {
          ...old,
          data: old.data.map((l) => (l.id === id ? { ...l, ...data } : l)),
        });
      });
      return { snapshots };
    },
    onError: (err, _vars, ctx) => {
      ctx?.snapshots.forEach(([key, old]) => qc.setQueryData(key, old));
      message.error(getApiErrorMessage(err));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [LESSONS_QUERY_KEY] }),
    onSuccess: () => message.success('Lesson updated'),
  });
}

export function useDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: lessonApi.delete,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: [LESSONS_QUERY_KEY] });
      const snapshots = qc.getQueriesData<PaginatedResponse<Lesson>>({ queryKey: [LESSONS_QUERY_KEY] });
      snapshots.forEach(([key, old]) => {
        if (!old) return;
        qc.setQueryData<PaginatedResponse<Lesson>>(key, {
          ...old,
          data: old.data.filter((l) => l.id !== id),
          totalItems: old.totalItems - 1,
        });
      });
      return { snapshots };
    },
    onError: (err, _id, ctx) => {
      ctx?.snapshots.forEach(([key, old]) => qc.setQueryData(key, old));
      message.error(getApiErrorMessage(err));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [LESSONS_QUERY_KEY] }),
    onSuccess: () => message.success('Lesson deleted'),
  });
}
