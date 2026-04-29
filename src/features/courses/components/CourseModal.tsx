import { useEffect } from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppModal } from '@/components/common/AppModal';
import { courseSchema, type CourseFormValues } from '../schemas/courseSchema';
import type { Course } from '@/types/course.types';

interface CourseModalProps {
  open: boolean;
  editing: Course | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: CourseFormValues) => void;
}

export function CourseModal({ open, editing, loading, onClose, onSubmit }: CourseModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: { title: '', description: '', level: 'BEGINNER' },
  });

  useEffect(() => {
    if (editing) {
      reset({ title: editing.title, description: editing.description, level: editing.level });
    } else {
      reset({ title: '', description: '', level: 'BEGINNER' });
    }
  }, [editing, reset, open]);

  return (
    <AppModal
      title={editing ? 'Edit Course' : 'Create Course'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ marginTop: 16 }}>
        <Form.Item label="Title" validateStatus={errors.title ? 'error' : ''} help={errors.title?.message}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Course title" />}
          />
        </Form.Item>

        <Form.Item label="Description" validateStatus={errors.description ? 'error' : ''} help={errors.description?.message}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input.TextArea {...field} rows={3} placeholder="Course description" />}
          />
        </Form.Item>

        <Form.Item label="Level" validateStatus={errors.level ? 'error' : ''} help={errors.level?.message}>
          <Controller
            name="level"
            control={control}
            render={({ field }) => (
              <Select {...field} options={[
                { value: 'BEGINNER', label: 'Beginner' },
                { value: 'INTERMEDIATE', label: 'Intermediate' },
                { value: 'ADVANCED', label: 'Advanced' },
              ]} />
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
