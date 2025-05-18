import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const BillLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider breakpoint="lg" collapsedWidth="0">
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
      <Layout>
        <Header style={{ background: '#fff', padding: 16 }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>Trang quản lý hóa đơn</h1>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
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
