import { useState } from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCourses } from '../hooks/useCourses';
import { useCreateCourse, useUpdateCourse, useDeleteCourse } from '../hooks/useCourseActions';
import { CourseTable } from '../components/CourseTable';
import { CourseModal } from '../components/CourseModal';
import { AppPagination } from '@/components/common/AppPagination';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import type { Course } from '@/types/course.types';
import type { CourseFormValues } from '../schemas/courseSchema';

const { Title } = Typography;

export function CoursesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);

  const { data, isLoading } = useCourses({ page: page - 1, size: pageSize });
  const { mutate: createCourse, isPending: creating } = useCreateCourse();
  const { mutate: updateCourse, isPending: updating } = useUpdateCourse();
  const { mutate: deleteCourse } = useDeleteCourse();

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditing(course);
    setModalOpen(true);
  };

  const handleSubmit = (values: CourseFormValues) => {
    if (editing) {
      updateCourse(
        { id: editing.id, data: values },
        { onSuccess: () => setModalOpen(false) },
      );
    } else {
      createCourse(values, { onSuccess: () => setModalOpen(false) });
    }
  };

  return (
    <div>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Courses</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New Course
        </Button>
      </Space>

      <Card>
        {isLoading ? (
          <SkeletonTable rows={pageSize} columns={4} />
        ) : (
          <>
            <CourseTable
              data={data?.data ?? []}
              loading={isLoading}
              onEdit={openEdit}
              onDelete={(id) => deleteCourse(id)}
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

      <CourseModal
        open={modalOpen}
        editing={editing}
        loading={creating || updating}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
