import { useQuery } from '@tanstack/react-query';
import { lessonApi } from '@/api/lessonApi';
import type { PaginationParams } from '@/types/api.types';

export const LESSONS_QUERY_KEY = 'lessons';

export function useLessons(params: PaginationParams) {
  return useQuery({
    queryKey: [LESSONS_QUERY_KEY, params],
    queryFn: () => lessonApi.getAll(params),
    select: (res) => res.data,
  });
}
