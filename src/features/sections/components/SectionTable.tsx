import { Table, Button, Space, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, OrderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import type { ColumnsType } from 'antd/es/table';
import type { Section } from '@/types/section.types';

interface SectionTableProps {
  courseId: string;
  data: Section[];
  loading: boolean;
  onEdit: (section: Section) => void;
  onDelete: (id: string) => void;
}

export function SectionTable({ courseId, data, loading, onEdit, onDelete }: SectionTableProps) {
  const navigate = useNavigate();

  const columns: ColumnsType<Section> = [
    {
      title: '#',
      key: 'index',
      width: 50,
      render: (_, __, idx) => idx + 1,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space>
          <Tooltip title="Manage Lessons">
            <Button
              size="small"
              icon={<OrderedListOutlined />}
              onClick={() => navigate(`/courses/${courseId}/sections/${record.id}/lessons`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete section?"
              onConfirm={() => onDelete(record.id)}
              okText="Delete"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
    />
  );
}
