import { useEffect } from 'react';
import { Form, Input, InputNumber, Button, Space } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppModal } from '@/components/common/AppModal';
import { sectionSchema, type SectionFormValues } from '../schemas/sectionSchema';
import type { Section } from '@/types/section.types';

interface SectionModalProps {
  open: boolean;
  editing: Section | null;
  courseId: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: SectionFormValues) => void;
}

export function SectionModal({ open, editing, courseId, loading, onClose, onSubmit }: SectionModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: { title: '', courseId, sort: undefined },
  });

  useEffect(() => {
    reset({ title: editing?.title ?? '', courseId, sort: editing?.sort });
  }, [editing, courseId, reset, open]);

  return (
    <AppModal
      title={editing ? 'Edit Section' : 'Create Section'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ marginTop: 16 }}>
        <Form.Item label="Title" validateStatus={errors.title ? 'error' : ''} help={errors.title?.message}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Section title" />}
          />
        </Form.Item>

        <Form.Item label="Sort" validateStatus={errors.sort ? 'error' : ''} help={errors.sort?.message}>
          <Controller
            name="sort"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                placeholder="Sort order"
                style={{ width: '100%' }}
              />
            )}
          />
        </Form.Item>

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
