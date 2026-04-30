import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { videoApi } from '@/api/videoApi';
import { getApiErrorMessage } from '@/utils/helpers';
import { VIDEOS_QUERY_KEY } from './useVideos';

export function useUploadVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      file,
      onProgress,
    }: {
      name: string;
      file: File;
      onProgress?: (percent: number) => void;
    }) => videoApi.upload(name, file, onProgress),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [VIDEOS_QUERY_KEY] });
      message.success('Video uploaded successfully');
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}

export function useDeleteVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: videoApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [VIDEOS_QUERY_KEY] });
      message.success('Video deleted');
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}
