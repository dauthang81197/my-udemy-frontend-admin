import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button, Card, Space, Typography, Breadcrumb } from 'antd';
import { PlusOutlined, ArrowLeftOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useSections } from '../hooks/useSections';
import {
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useDownloadSectionTemplate,
  useImportSections,
} from '../hooks/useSectionActions';
import { SectionTable } from '../components/SectionTable';
import { SectionModal } from '../components/SectionModal';
import { AppPagination } from '@/components/common/AppPagination';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import type { Section } from '@/types/section.types';
import type { SectionFormValues } from '../schemas/sectionSchema';

const { Title } = Typography;

export function SectionsPage() {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Section | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useSections({ page: page - 1, size: pageSize, sort: ['title,asc'] });
  const { mutate: createSection, isPending: creating } = useCreateSection();
  const { mutate: updateSection, isPending: updating } = useUpdateSection();
  const { mutate: deleteSection } = useDeleteSection();
  const { mutate: downloadTemplate, isPending: downloading } = useDownloadSectionTemplate();
  const { mutate: importSections, isPending: importing } = useImportSections();

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importSections({ courseId, file });
    }
    e.target.value = '';
  };

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (section: Section) => {
    setEditing(section);
    setModalOpen(true);
  };

  const handleSubmit = (values: SectionFormValues) => {
    if (editing) {
      updateSection(
        { id: editing.id, data: values },
        { onSuccess: () => setModalOpen(false) },
      );
    } else {
      createSection(values, { onSuccess: () => setModalOpen(false) });
    }
  };

  return (
    <div>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <span style={{ cursor: 'pointer' }} onClick={() => navigate('/courses')}>Courses</span> },
          { title: 'Sections' },
        ]}
      />

      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/courses')} />
          <Title level={3} style={{ margin: 0 }}>Sections</Title>
        </Space>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            loading={downloading}
            onClick={() => downloadTemplate(courseId)}
          >
            Download Template
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            style={{ display: 'none' }}
            onChange={handleImportFileChange}
          />
          <Button
            icon={<UploadOutlined />}
            loading={importing}
            onClick={() => fileInputRef.current?.click()}
          >
            Import
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New Section
          </Button>
        </Space>
      </Space>

      <Card>
        {isLoading ? (
          <SkeletonTable rows={pageSize} columns={3} />
        ) : (
          <>
            <SectionTable
              courseId={courseId}
              data={data?.data ?? []}
              loading={isLoading}
              onEdit={openEdit}
              onDelete={(id) => deleteSection(id)}
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

      <SectionModal
        open={modalOpen}
        editing={editing}
        courseId={courseId}
        loading={creating || updating}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
