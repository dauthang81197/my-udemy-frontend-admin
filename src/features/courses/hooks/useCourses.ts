import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/api/courseApi';
import type { PaginationParams } from '@/types/api.types';

export const COURSES_QUERY_KEY = 'courses';

export function useCourses(params: PaginationParams) {
  return useQuery({
    queryKey: [COURSES_QUERY_KEY, params],
    queryFn: () => courseApi.getAll(params),
    select: (res) => res.data,
  });
}
