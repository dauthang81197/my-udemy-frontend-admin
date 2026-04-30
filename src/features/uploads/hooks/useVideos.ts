import { useQuery } from '@tanstack/react-query';
import { videoApi } from '@/api/videoApi';
import type { PaginationParams } from '@/types/api.types';

export const VIDEOS_QUERY_KEY = 'videos';

export function useVideos(params: PaginationParams) {
  return useQuery({
    queryKey: [VIDEOS_QUERY_KEY, params],
    queryFn: () => videoApi.getAll(params),
    select: (res) => res.data,
  });
}

export function useVideoDetail(id: string | null) {
  return useQuery({
    queryKey: [VIDEOS_QUERY_KEY, id],
    queryFn: () => videoApi.getById(id!),
    select: (res) => res.data.data,
    enabled: !!id,
    // Không cache lâu vì URL chỉ có hiệu lực 1 giờ
    staleTime: 0,
    gcTime: 0,
  });
}
