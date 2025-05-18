// teacher/index.tsx
import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import TeacherList from './TeacherList';
import TeacherDetail from './TeacherDetail';
import TeacherFilter from '../../../components/TeacherFilter';
//import { teachers as fakeTeachers } from '../../../assets/fake_data/teachers';

const { Content } = Layout;

const TeacherLayout: React.FC = () => {

  // useEffect(() => {
  //   dispatch(setTeachers(teachers));
  //   dispatch(setFilteredTeachers(teachers)); // Khởi tạo filteredTeachers bằng allTeachers
  // }, [dispatch]);

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