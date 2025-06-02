// teacher/index.tsx
import { Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import TeacherFilter from '../../../components/TeacherFilter';
import TeacherDetail from './TeacherDetail';
import TeacherList from './TeacherList';
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
  TeacherDetailPage, TeacherIndex, TeacherLayout
};
