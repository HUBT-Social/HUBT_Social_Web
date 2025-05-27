import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Dropdown, Button } from 'antd';
import {
  DownOutlined,
  BellOutlined,
  MailOutlined,
  WarningOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const menuItems = [
  {
    key: '/dashboard/notition',
    label: 'Tất cả thông báo',
    icon: <BellOutlined />,
  },
  {
    key: '/dashboard/notition/condition',
    label: 'Gửi thông báo',
    icon: <MailOutlined />,
  },
  {
    key: '/dashboard/notition/academic',
    label: 'Thông báo học tập',
    icon: <WarningOutlined />,
  },
];

const NotificationLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentItem = menuItems.find((item) => location.pathname.includes(item.key)) || menuItems[0];
  const [selectedItem, setSelectedItem] = useState(currentItem);

  const handleMenuClick = ({ key }: { key: string }) => {
    const chosen = menuItems.find((item) => item.key === key);
    if (chosen) {
      setSelectedItem(chosen);
      navigate(key);
    }
  };

  const dropdownMenu = (
    <Menu onClick={handleMenuClick} selectedKeys={[selectedItem.key]}>
      {menuItems.map((item) => (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh'}}>
      <Header
        style={{
          background: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          boxShadow: '0 1px 3px rgba(255, 255, 255, 0.1)',
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#1e293b', margin: 0 }}>
          Quản lý Thông báo
        </h1>

        <Dropdown overlay={dropdownMenu} trigger={['click']}>
          <Button type="text" icon={selectedItem.icon} style={{ color: '#1e40af' }}>
            {selectedItem.label} <DownOutlined />
          </Button>
        </Dropdown>
      </Header>

      <Content
        style={{
          padding: 16,
          background: '#ffffff',
          minHeight: 280,
          borderRadius: 6,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center', color: '#64748b', background: 'transparent' }}>
        © {new Date().getFullYear()} Hệ thống quản lý thông báo
      </Footer>
    </Layout>
  );
};

export default NotificationLayout;
