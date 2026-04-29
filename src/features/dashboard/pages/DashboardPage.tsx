import { Card, Col, Row, Statistic, Typography } from 'antd';
import {
  BookOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/api/courseApi';

const { Title } = Typography;

export function DashboardPage() {
  const { data: coursesData } = useQuery({
    queryKey: ['courses', { page: 0, size: 1 }],
    queryFn: () => courseApi.getAll({ page: 0, size: 1 }),
    select: (res) => res.data,
  });

  const stats = [
    {
      title: 'Total Courses',
      value: coursesData?.totalItems ?? 0,
      icon: <BookOutlined style={{ fontSize: 28, color: '#1677ff' }} />,
      color: '#e6f4ff',
    },
    {
      title: 'Total Users',
      value: 0,
      icon: <TeamOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
      color: '#f6ffed',
    },
    {
      title: 'Total Videos',
      value: 0,
      icon: <VideoCameraOutlined style={{ fontSize: 28, color: '#fa8c16' }} />,
      color: '#fff7e6',
    },
    {
      title: 'Revenue',
      value: 0,
      prefix: '$',
      icon: <RiseOutlined style={{ fontSize: 28, color: '#eb2f96' }} />,
      color: '#fff0f6',
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Dashboard</Title>
      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col key={stat.title} xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {stat.icon}
                </div>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.prefix}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Recent Activity" style={{ borderRadius: 12, minHeight: 300 }}>
            <Typography.Text type="secondary">No recent activity</Typography.Text>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Quick Stats" style={{ borderRadius: 12, minHeight: 300 }}>
            <Typography.Text type="secondary">Coming soon...</Typography.Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
