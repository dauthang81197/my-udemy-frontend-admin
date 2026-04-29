import { Layout, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  MoonOutlined,
  SunOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

const { Header } = Layout;
const { Text } = Typography;

export function AppHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { mode, toggle } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dropdownItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Button
        type="text"
        icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggle}
        style={{ color: 'inherit' }}
      />
      <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
        <Space style={{ cursor: 'pointer' }}>
          <Avatar icon={<UserOutlined />} size="small" />
          <Text style={{ color: 'inherit' }}>{user?.full_name ?? user?.username}</Text>
        </Space>
      </Dropdown>
    </Header>
  );
}
