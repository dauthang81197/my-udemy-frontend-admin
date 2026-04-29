import { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

const { Content } = Layout;

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 220;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout style={{ marginLeft: siderWidth, transition: 'margin-left 0.2s' }}>
        <AppHeader />
        <Content style={{ margin: 24, minHeight: 'calc(100vh - 64px - 48px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
