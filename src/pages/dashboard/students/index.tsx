import React, {} from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

const { Content } = Layout;

const StudentsLayout: React.FC = () => {
  

  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
      }}
    >
      {/* Truyền props qua context */}
      <Outlet />
    </Content>
  );
};

const StudentList: React.FC = () => <StudentList />;
export default StudentsLayout;
