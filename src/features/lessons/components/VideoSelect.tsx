import { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import { useVideos } from '@/features/uploads/hooks/useVideos';
import type { VideoFile } from '@/types/video.types';

interface VideoSelectProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
}

const PAGE_SIZE = 10;

export function VideoSelect({ value, onChange }: VideoSelectProps) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [allVideos, setAllVideos] = useState<VideoFile[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isFetching } = useVideos({ page, size: PAGE_SIZE });

  useEffect(() => {
    if (!data) return;
    // data.page từ response xác định reset hay append — không cần local page trong deps
    setAllVideos(prev => (data.page === 0 ? data.data : [...prev, ...data.data]));
    setHasMore(data.hasNext);
  }, [data]);

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 60 && !isFetching && hasMore) {
      setPage(p => p + 1);
    }
  };

  const filtered = search
    ? allVideos.filter(v => v.name.toLowerCase().includes(search.toLowerCase()))
    : allVideos;

  return (
    <Select
      showSearch
      allowClear
      value={value || undefined}
      onChange={onChange}
      placeholder="Select a video"
      filterOption={false}
      onSearch={setSearch}
      onPopupScroll={handlePopupScroll}
      notFoundContent={isFetching ? <Spin size="small" /> : 'No videos found'}
      options={filtered.map(v => ({ value: v.id, label: v.name }))}
      dropdownRender={(menu) => (
        <>
          {menu}
          {isFetching && hasMore && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <Spin size="small" />
            </div>
          )}
        </>
      )}
      style={{ width: '100%' }}
    />
  );
}
