import { Table, Button, Space, Popconfirm, Tag, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import type { ColumnsType } from "antd/es/table";
import type { Course } from "@/types/course.types";
import { StatusBadge } from "@/components/common/StatusBadge";

const LEVEL_COLOR: Record<string, string> = {
  BEGINNER: "green",
  INTERMEDIATE: "orange",
  ADVANCED: "red",
};

interface CourseTableProps {
  data: Course[];
  loading: boolean;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
}

export function CourseTable({
  data,
  loading,
  onEdit,
  onDelete,
  onPublish,
}: CourseTableProps) {
  const navigate = useNavigate();

  const columns: ColumnsType<Course> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      width: 130,
      render: (level: string) => <Tag color={LEVEL_COLOR[level]}>{level}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space>
          <Tooltip title="Manage Sections">
            <Button
              size="small"
              icon={<AppstoreOutlined />}
              onClick={() => navigate(`/courses/${record.id}/sections`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete course?"
              description="This action cannot be undone."
              onConfirm={() => onDelete(record.id)}
              okText="Delete"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>

          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>

          <Tooltip title="Public">
            <Button
              size="small"
              icon={<CheckOutlined />}
              onClick={() => onPublish(record.id)}
            />
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
      scroll={{ x: 600 }}
    />
  );
}
