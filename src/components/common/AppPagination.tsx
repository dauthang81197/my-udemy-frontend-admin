import { Pagination } from 'antd';

interface AppPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
}

export function AppPagination({ page, pageSize, total, onChange }: AppPaginationProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
      <Pagination
        current={page}
        pageSize={pageSize}
        total={total}
        showSizeChanger
        showTotal={(t) => `Total ${t} items`}
        onChange={onChange}
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}
