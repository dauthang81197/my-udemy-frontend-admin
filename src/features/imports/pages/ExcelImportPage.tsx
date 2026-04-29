import { useState } from 'react';
import { Card, Typography, Upload, Button, Table, Alert, Space, message, Tag } from 'antd';
import { InboxOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface ImportRow {
  key: string;
  title: string;
  description: string;
  level: string;
  status: 'valid' | 'invalid';
  error?: string;
}

const VALID_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

function validateRow(row: Record<string, string>, idx: number): ImportRow {
  const title = row['title'] ?? row['Title'] ?? '';
  const description = row['description'] ?? row['Description'] ?? '';
  const level = (row['level'] ?? row['Level'] ?? '').toUpperCase();

  if (!title) return { key: String(idx), title, description, level, status: 'invalid', error: 'Title is required' };
  if (!VALID_LEVELS.includes(level)) return { key: String(idx), title, description, level, status: 'invalid', error: `Invalid level: ${level}` };
  return { key: String(idx), title, description, level, status: 'valid' };
}

export function ExcelImportPage() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [imported, setImported] = useState(false);

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
      setRows(json.map((r, i) => validateRow(r, i)));
    };
    reader.readAsArrayBuffer(file);
  };

  const props: UploadProps = {
    accept: '.xlsx,.xls,.csv',
    beforeUpload: (file) => {
      setFileList([file]);
      setRows([]);
      setImported(false);
      parseFile(file);
      return false;
    },
    fileList,
    onRemove: () => {
      setFileList([]);
      setRows([]);
    },
  };

  const validRows = rows.filter((r) => r.status === 'valid');

  const handleImport = () => {
    message.success(`Imported ${validRows.length} courses successfully`);
    setImported(true);
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', ellipsis: true },
    { title: 'Level', dataIndex: 'level', width: 130, render: (l: string) => <Tag>{l}</Tag> },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      render: (s: string, r: ImportRow) =>
        s === 'valid' ? (
          <Tag color="green">Valid</Tag>
        ) : (
          <Tag color="red" title={r.error}>Invalid</Tag>
        ),
    },
    { title: 'Error', dataIndex: 'error', render: (e?: string) => e ? <Text type="danger">{e}</Text> : null },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Excel Import</Title>
      <Card style={{ maxWidth: 800 }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Alert
            type="info"
            message="Excel file must have columns: title, description, level (BEGINNER / INTERMEDIATE / ADVANCED)"
          />

          <Dragger {...props}>
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">Click or drag Excel / CSV file here</p>
          </Dragger>

          {rows.length > 0 && (
            <>
              <Space>
                <Text>Total: <strong>{rows.length}</strong></Text>
                <Text style={{ color: '#52c41a' }}>Valid: <strong>{validRows.length}</strong></Text>
                <Text type="danger">Invalid: <strong>{rows.length - validRows.length}</strong></Text>
              </Space>
              <Table
                rowKey="key"
                columns={columns}
                dataSource={rows}
                size="small"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 600 }}
              />
              {!imported && validRows.length > 0 && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleImport}
                  block
                >
                  Import {validRows.length} valid courses
                </Button>
              )}
              {imported && <Alert type="success" message={`Successfully imported ${validRows.length} courses`} />}
            </>
          )}
        </Space>
      </Card>
    </div>
  );
}
