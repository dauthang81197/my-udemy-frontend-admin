import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button, Card, Space, Typography, Breadcrumb } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useLessons } from '../hooks/useLessons';
import { useCreateLesson, useUpdateLesson, useDeleteLesson } from '../hooks/useLessonActions';
import { LessonTable } from '../components/LessonTable';
import { LessonModal } from '../components/LessonModal';
import { AppPagination } from '@/components/common/AppPagination';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import type { Lesson } from '@/types/lesson.types';
import type { LessonFormValues } from '../schemas/lessonSchema';

const { Title } = Typography;

export function LessonsPage() {
  const { courseId = '', sectionId = '' } = useParams<{ courseId: string; sectionId: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Lesson | null>(null);

  const { data, isLoading } = useLessons({ page: page - 1, size: pageSize });
  const { mutate: createLesson, isPending: creating } = useCreateLesson();
  const { mutate: updateLesson, isPending: updating } = useUpdateLesson();
  const { mutate: deleteLesson } = useDeleteLesson();

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (lesson: Lesson) => {
    setEditing(lesson);
    setModalOpen(true);
  };

  const handleSubmit = (values: LessonFormValues) => {
    if (editing) {
      const { sectionId: _sid, ...updateData } = values;
      void _sid;
      updateLesson(
        { id: editing.id, data: updateData },
        { onSuccess: () => setModalOpen(false) },
      );
    } else {
      createLesson(values, { onSuccess: () => setModalOpen(false) });
    }
  };

  return (
    <div>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <span style={{ cursor: 'pointer' }} onClick={() => navigate('/courses')}>Courses</span> },
          { title: <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/courses/${courseId}/sections`)}>Sections</span> },
          { title: 'Lessons' },
        ]}
      />

      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/courses/${courseId}/sections`)} />
          <Title level={3} style={{ margin: 0 }}>Lessons</Title>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New Lesson
        </Button>
      </Space>

      <Card>
        {isLoading ? (
          <SkeletonTable rows={pageSize} columns={6} />
        ) : (
          <>
            <LessonTable
              data={data?.data ?? []}
              loading={isLoading}
              onEdit={openEdit}
              onDelete={(id) => deleteLesson(id)}
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

      <LessonModal
        open={modalOpen}
        editing={editing}
        sectionId={sectionId}
        loading={creating || updating}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
