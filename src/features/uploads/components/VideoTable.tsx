import { Table, Button, Popconfirm, Space, Tag, Typography, Tooltip } from 'antd';
import { DeleteOutlined, CopyOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { message } from 'antd';
import type { VideoFile } from '@/types/video.types';

const { Text } = Typography;

interface VideoTableProps {
  data: VideoFile[];
  loading: boolean;
  onPreview: (video: VideoFile) => void;
  onDelete: (id: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function VideoTable({ data, loading, onPreview, onDelete }: VideoTableProps) {
  const columns: ColumnsType<VideoFile> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (name: string, record) => (
        <Space
          style={{ cursor: 'pointer' }}
          onClick={() => onPreview(record)}
        >
          <PlayCircleOutlined style={{ color: '#1677ff', fontSize: 18 }} />
          <Text strong style={{ color: '#1677ff' }}>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'File',
      dataIndex: 'originalFilename',
      key: 'originalFilename',
      ellipsis: true,
      render: (filename: string, record) => (
        <Space>
          <Text type="secondary" style={{ maxWidth: 280, display: 'inline-block' }} ellipsis>
            {filename}
          </Text>
          <Tooltip title="Copy public URL">
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => {
                navigator.clipboard.writeText(record.publicUrl);
                message.success('URL copied');
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 100,
      render: (size: number) => formatBytes(size),
    },
    {
      title: 'Type',
      dataIndex: 'contentType',
      key: 'contentType',
      width: 110,
      render: (type: string) => <Tag>{type?.split('/')[1]?.toUpperCase() ?? type}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Uploaded',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Delete this video?"
          description="This action cannot be undone."
          onConfirm={() => onDelete(record.id)}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <Button danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
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
      scroll={{ x: 900 }}
    />
  );
}
