import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
const { Content } = Layout;

const BillLayout: React.FC = () => {
  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
      }}
    >
      <Outlet />
    </Content>
  );
};
export default BillLayout;