import { useQuery } from '@tanstack/react-query';
import { sectionApi } from '@/api/sectionApi';
import type { PaginationParams } from '@/types/api.types';

export const SECTIONS_QUERY_KEY = 'sections';

export function useSections(params: PaginationParams) {
  return useQuery({
    queryKey: [SECTIONS_QUERY_KEY, params],
    queryFn: () => sectionApi.getAll(params),
    select: (res) => res.data,
  });
}
