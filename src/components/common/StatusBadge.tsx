import { Tag } from 'antd';

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'green',
  BLOCKED: 'red',
  PENDING: 'orange',
  PUBLISHED: 'blue',
  DRAFT: 'default',
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Tag color={STATUS_COLOR[status] ?? 'default'}>{status}</Tag>;
}
