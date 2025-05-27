import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const BillLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        trigger={null} // Ẩn trigger mặc định khi responsive
        collapsible
        collapsed={collapsed}
      >
        <div className="text-white text-center py-4 font-bold text-lg">Quản lý Hóa đơn</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<FileTextOutlined />}>
            Tất cả hóa đơn
          </Menu.Item>
          <Menu.Item key="2" icon={<CheckCircleOutlined />}>
            Đã thanh toán
          </Menu.Item>
          <Menu.Item key="3" icon={<ClockCircleOutlined />}>
            Chưa thanh toán
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Nội dung chính */}
      <Layout className="site-layout">
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{ marginRight: 16 }}
          />
          <h1 style={{ margin: 0, fontSize: 20 }}>Trang quản lý hóa đơn</h1>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          © {new Date().getFullYear()} Hệ thống hóa đơn thông minh
        </Footer>
      </Layout>
    </Layout>
  );
};

export default BillLayout;