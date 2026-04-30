import { useRef } from 'react';
import { Modal, Typography, Spin } from 'antd';
import type { VideoFile } from '@/types/video.types';
import { useVideoDetail } from '../hooks/useVideos';

const { Text } = Typography;

interface VideoPreviewModalProps {
  video: VideoFile | null;
  onClose: () => void;
}

export function VideoPreviewModal({ video, onClose }: VideoPreviewModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch lại detail để lấy pre-signed URL mới (valid 1 giờ)
  const { data: detail, isLoading } = useVideoDetail(video?.id ?? null);

  const handleCancel = () => {
    videoRef.current?.pause();
    onClose();
  };

  return (
    <Modal
      open={!!video}
      title={video?.name}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnHidden
      centered
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Spin size="large" />
        </div>
      ) : detail ? (
        <>
          <video
            ref={videoRef}
            key={detail.presignedUrl}
            src={detail.presignedUrl}
            controls
            autoPlay
            style={{ width: '100%', borderRadius: 8, background: '#000', maxHeight: 450 }}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12, wordBreak: 'break-all' }}>
            {detail.originalFilename}
          </Text>
        </>
      ) : null}
    </Modal>
  );
}
