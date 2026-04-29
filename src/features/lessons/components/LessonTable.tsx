import { Table, Button, Space, Popconfirm, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, LinkOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Lesson } from '@/types/lesson.types';
import { StatusBadge } from '@/components/common/StatusBadge';

const TYPE_COLOR: Record<string, string> = {
  VIDEO: 'blue',
  FILE: 'purple',
  QUIZ: 'orange',
  ARTICLE: 'cyan',
};

interface LessonTableProps {
  data: Lesson[];
  loading: boolean;
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: string) => void;
}

export function LessonTable({ data, loading, onEdit, onDelete }: LessonTableProps) {
  const columns: ColumnsType<Lesson> = [
    {
      title: '#',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 50,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => <Tag color={TYPE_COLOR[type]}>{type}</Tag>,
    },
    {
      title: 'Preview',
      dataIndex: 'isPreview',
      key: 'isPreview',
      width: 80,
      render: (v: boolean) => v ? <EyeOutlined style={{ color: '#1677ff' }} /> : null,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: 'Video',
      dataIndex: 'videoUrl',
      key: 'videoUrl',
      width: 70,
      render: (url: string) =>
        url ? (
          <Tooltip title={url}>
            <a href={url} target="_blank" rel="noreferrer"><LinkOutlined /></a>
          </Tooltip>
        ) : null,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete lesson?"
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
      scroll={{ x: 700 }}
    />
  );
}
