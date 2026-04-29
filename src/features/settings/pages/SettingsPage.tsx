import { Card, Typography, Switch, Divider, Space, Select, Form, Button, message } from 'antd';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';

const { Title, Text } = Typography;

export function SettingsPage() {
  const { mode, setMode } = useThemeStore();
  const user = useAuthStore((s) => s.user);

  const handleSave = () => {
    message.success('Settings saved');
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <Title level={3} style={{ marginBottom: 24 }}>Settings</Title>

      <Card title="Appearance" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <div>
              <Text strong>Dark Mode</Text>
              <br />
              <Text type="secondary">Switch between light and dark theme</Text>
            </div>
            <Switch
              checked={mode === 'dark'}
              onChange={(checked) => setMode(checked ? 'dark' : 'light')}
            />
          </Space>
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <div>
              <Text strong>Language</Text>
              <br />
              <Text type="secondary">Interface language</Text>
            </div>
            <Select
              defaultValue="en"
              style={{ width: 140 }}
              options={[
                { value: 'en', label: 'English' },
                { value: 'vi', label: 'Tiếng Việt' },
              ]}
            />
          </Space>
        </Space>
      </Card>

      <Card title="Account" style={{ marginBottom: 16 }}>
        <Form layout="vertical">
          <Form.Item label="Email">
            <Text>{user?.email}</Text>
          </Form.Item>
          <Form.Item label="Username">
            <Text>{user?.username}</Text>
          </Form.Item>
          <Form.Item label="Full Name">
            <Text>{user?.full_name}</Text>
          </Form.Item>
          <Form.Item label="Status">
            <Text>{user?.status}</Text>
          </Form.Item>
        </Form>
      </Card>

      <Button type="primary" onClick={handleSave}>Save Settings</Button>
    </div>
  );
}
