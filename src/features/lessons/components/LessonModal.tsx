import { useEffect } from 'react';
import { Form, Input, Select, Switch, InputNumber, Button, Space } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppModal } from '@/components/common/AppModal';
import { lessonSchema, type LessonFormValues } from '../schemas/lessonSchema';
import { VideoSelect } from './VideoSelect';
import type { Lesson } from '@/types/lesson.types';

interface LessonModalProps {
  open: boolean;
  editing: Lesson | null;
  sectionId: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: LessonFormValues) => void;
}

export function LessonModal({ open, editing, sectionId, loading, onClose, onSubmit }: LessonModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'VIDEO',
      videoFileId: undefined,
      isPreview: false,
      sortOrder: 0,
      sectionId,
    },
  });

  const lessonType = watch('type');

  useEffect(() => {
    if (editing) {
      reset({
        title: editing.title,
        description: editing.description ?? '',
        type: editing.type,
        videoFileId: editing.videoFileId || undefined,
        isPreview: editing.isPreview,
        sortOrder: editing.sortOrder,
        sectionId,
      });
    } else {
      reset({ title: '', description: '', type: 'VIDEO', videoFileId: undefined, isPreview: false, sortOrder: 0, sectionId });
    }
  }, [editing, sectionId, reset, open]);

  return (
    <AppModal
      title={editing ? 'Edit Lesson' : 'Create Lesson'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ marginTop: 16 }}>
        <Form.Item label="Title" validateStatus={errors.title ? 'error' : ''} help={errors.title?.message}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Lesson title" />}
          />
        </Form.Item>

        <Form.Item label="Description">
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input.TextArea {...field} rows={2} placeholder="Optional description" />}
          />
        </Form.Item>

        <Form.Item label="Type">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select {...field} options={[
                { value: 'VIDEO', label: 'Video' },
                { value: 'FILE', label: 'File' },
                { value: 'QUIZ', label: 'Quiz' },
                { value: 'ARTICLE', label: 'Article' },
              ]} />
            )}
          />
        </Form.Item>

        {lessonType === 'VIDEO' && (
          <Form.Item
            label="Video"
            validateStatus={errors.videoFileId ? 'error' : ''}
            help={errors.videoFileId?.message}
          >
            <Controller
              name="videoFileId"
              control={control}
              render={({ field }) => (
                <VideoSelect value={field.value} onChange={field.onChange} />
              )}
            />
          </Form.Item>
        )}

        <Space style={{ width: '100%' }}>
          <Form.Item label="Sort Order">
            <Controller
              name="sortOrder"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} min={0} style={{ width: 100 }} />
              )}
            />
          </Form.Item>

          <Form.Item label="Preview">
            <Controller
              name="isPreview"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} />
              )}
            />
          </Form.Item>
        </Space>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editing ? 'Update' : 'Create'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </AppModal>
  );
}
