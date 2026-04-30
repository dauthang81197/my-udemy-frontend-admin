import { useState } from 'react';
import { Form, Input, Button, Space, Progress, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { UploadFile } from 'antd';
import { message } from 'antd';
import { AppModal } from '@/components/common/AppModal';
import { useUploadVideo } from '../hooks/useVideoActions';

const { Dragger } = Upload;

const schema = z.object({
  name: z.string().min(1, 'Video name is required').max(200),
});

type FormValues = z.infer<typeof schema>;

interface VideoUploadModalProps {
  open: boolean;
  onClose: () => void;
}

export function VideoUploadModal({ open, onClose }: VideoUploadModalProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const { mutate: uploadVideo, isPending } = useUploadVideo();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  const handleClose = () => {
    reset();
    setFileList([]);
    setSelectedFile(null);
    setProgress(0);
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    if (!selectedFile) {
      message.warning('Please select a video file');
      return;
    }
    const file = selectedFile;
    setProgress(0);
    uploadVideo(
      {
        name: values.name,
        file,
        onProgress: setProgress,
      },
      { onSuccess: handleClose },
    );
  };

  return (
    <AppModal
      title="Upload Video"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={520}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ marginTop: 16 }}>
        <Form.Item label="Video Name" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter video name" />}
          />
        </Form.Item>

        <Form.Item label="File" required>
          <Dragger
            multiple={false}
            fileList={fileList}
            beforeUpload={(file) => {
              const isVideo = file.type.startsWith('video/');
              if (!isVideo) {
                message.error('Only video files are allowed');
                return Upload.LIST_IGNORE;
              }
              const isUnder2G = file.size / 1024 / 1024 / 1024 < 2;
              if (!isUnder2G) {
                message.error('File must be smaller than 2GB');
                return Upload.LIST_IGNORE;
              }
              setSelectedFile(file);
              setFileList([file as unknown as UploadFile]);
              return false;
            }}
            onRemove={() => { setFileList([]); setSelectedFile(null); }}
            accept="video/*"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag video file here</p>
            <p className="ant-upload-hint">Supports MP4, MOV, AVI — up to 2GB</p>
          </Dragger>
        </Form.Item>

        {isPending && <Progress percent={progress} status="active" style={{ marginBottom: 12 }} />}

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleClose} disabled={isPending}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isPending} disabled={!fileList.length}>
              {isPending ? 'Uploading...' : 'Upload'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </AppModal>
  );
}
