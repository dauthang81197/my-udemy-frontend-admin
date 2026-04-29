import { useState } from 'react';
import { Card, Typography, Upload, Button, Progress, Alert, Space, message } from 'antd';
import { InboxOutlined, CopyOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

const { Title, Text } = Typography;
const { Dragger } = Upload;

export function UploadVideoPage() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    if (!fileList.length) {
      message.warning('Please select a file first');
      return;
    }
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadedUrl('https://example.com/videos/uploaded-video.mp4');
          message.success('Upload complete!');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const props: UploadProps = {
    multiple: false,
    beforeUpload: (file) => {
      const isVideo = file.type.startsWith('video/');
      if (!isVideo) {
        message.error('Only video files are allowed');
        return false;
      }
      const isUnder2G = file.size / 1024 / 1024 / 1024 < 2;
      if (!isUnder2G) {
        message.error('File must be smaller than 2GB');
        return false;
      }
      setFileList([file]);
      setUploadedUrl(null);
      return false;
    },
    fileList,
    onRemove: () => {
      setFileList([]);
      setUploadedUrl(null);
    },
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Upload Video</Title>
      <Card style={{ maxWidth: 640 }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Dragger {...props} style={{ borderRadius: 8 }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag video file to upload</p>
            <p className="ant-upload-hint">
              Supports MP4, MOV, AVI up to 2GB
            </p>
          </Dragger>

          {uploading && <Progress percent={progress} status="active" />}

          {uploadedUrl && (
            <Alert
              type="success"
              message="Upload Successful"
              description={
                <Space>
                  <Text code style={{ wordBreak: 'break-all' }}>{uploadedUrl}</Text>
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => {
                      navigator.clipboard.writeText(uploadedUrl);
                      message.success('URL copied');
                    }}
                  />
                </Space>
              }
            />
          )}

          <Button
            type="primary"
            onClick={handleUpload}
            loading={uploading}
            disabled={!fileList.length}
            block
          >
            {uploading ? 'Uploading...' : 'Start Upload'}
          </Button>
        </Space>
      </Card>
    </div>
  );
}
