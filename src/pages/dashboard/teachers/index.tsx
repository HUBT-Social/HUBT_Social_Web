// teacher/index.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import TeacherList from './TeacherList';
import TeacherDetail from './TeacherDetail';
import TeacherFilter from '../../../components/TeacherFilter';

const { Content } = Layout;

const TeacherLayout: React.FC = () => {
  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
      }}
    >
      <TeacherFilter /> 
      <Outlet />
    </Content>
  );
};

const TeacherIndex: React.FC = () => <TeacherList />;
const TeacherDetailPage: React.FC = () => <TeacherDetail />;

export {
  TeacherLayout,
  TeacherIndex,
  TeacherDetailPage
};
