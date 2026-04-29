import { useState } from 'react';
import { Card, Typography, Table, Input, Space, Tag, Avatar, Tooltip, Button } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery } from '@tanstack/react-query';
import { AppPagination } from '@/components/common/AppPagination';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDate } from '@/utils/helpers';
import type { User } from '@/types/user.types';

const { Title } = Typography;

function useUsers(params: { page: number; size: number; search?: string }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async (): Promise<{ data: User[]; totalItems: number }> => {
      await new Promise((r) => setTimeout(r, 300));
      return { data: [], totalItems: 0 };
    },
  });
}

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useUsers({ page: page - 1, size: pageSize, search });

  const columns: ColumnsType<User> = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <div>
            <div style={{ fontWeight: 500 }}>{record.full_name}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 110,
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Block user">
            <Tag
              color={record.status === 'ACTIVE' ? 'red' : 'green'}
              style={{ cursor: 'pointer' }}
            >
              {record.status === 'ACTIVE' ? 'Block' : 'Activate'}
            </Tag>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Users</Title>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by name or email..."
          style={{ width: 280 }}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          allowClear
        />
      </Space>

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data?.data ?? []}
          loading={isLoading}
          pagination={false}
          scroll={{ x: 700 }}
          locale={{ emptyText: 'No users found. Connect the Users API to populate this table.' }}
        />
        <AppPagination
          page={page}
          pageSize={pageSize}
          total={data?.totalItems ?? 0}
          onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
        />
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Space direction="vertical">
          <Typography.Text type="secondary">
            <strong>Note:</strong> The Users API endpoint is not included in the current API docs.
            Add the user listing endpoint to <code>src/api/userApi.ts</code> and connect it here.
          </Typography.Text>
          <Button type="dashed" disabled>Connect Users API</Button>
        </Space>
      </Card>
    </div>
  );
}
