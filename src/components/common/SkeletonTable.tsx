import { Skeleton, Space } from 'antd';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <Space key={rowIdx} style={{ width: '100%', justifyContent: 'space-between' }}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton.Input key={colIdx} active style={{ width: `${Math.floor(100 / columns)}%` }} />
          ))}
        </Space>
      ))}
    </Space>
  );
}
