import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  UploadOutlined,
  FileExcelOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router';

const { Sider } = Layout;

interface AppSidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
}

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/courses', icon: <BookOutlined />, label: 'Courses' },
  { key: '/uploads', icon: <UploadOutlined />, label: 'Upload Video' },
  { key: '/imports', icon: <FileExcelOutlined />, label: 'Excel Import' },
  { key: '/users', icon: <TeamOutlined />, label: 'Users' },
  { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
];

export function AppSidebar({ collapsed, onCollapse }: AppSidebarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const selectedKey = menuItems.find((item) => pathname.startsWith(item.key))?.key ?? '/dashboard';

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
      width={220}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: collapsed ? 14 : 18,
          letterSpacing: 1,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {collapsed ? 'U' : 'Udemy Admin'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
}
