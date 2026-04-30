import { useState } from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useVideos } from '../hooks/useVideos';
import { useDeleteVideo } from '../hooks/useVideoActions';
import { VideoTable } from '../components/VideoTable';
import { VideoUploadModal } from '../components/VideoUploadModal';
import { VideoPreviewModal } from '../components/VideoPreviewModal';
import { AppPagination } from '@/components/common/AppPagination';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import type { VideoFile } from '@/types/video.types';

const { Title } = Typography;

export function UploadVideoPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<VideoFile | null>(null);

  const { data, isLoading } = useVideos({ page: page - 1, size: pageSize });
  const { mutate: deleteVideo } = useDeleteVideo();

  return (
    <div>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Upload Video</Title>
        <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadOpen(true)}>
          Upload Video
        </Button>
      </Space>

      <Card>
        {isLoading ? (
          <SkeletonTable rows={pageSize} columns={6} />
        ) : (
          <>
            <VideoTable
              data={data?.data ?? []}
              loading={isLoading}
              onPreview={setPreviewVideo}
              onDelete={(id) => deleteVideo(id)}
            />
            <AppPagination
              page={page}
              pageSize={pageSize}
              total={data?.totalItems ?? 0}
              onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
            />
          </>
        )}
      </Card>

      <VideoUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />

      <VideoPreviewModal
        video={previewVideo}
        onClose={() => setPreviewVideo(null)}
      />
    </div>
  );
}
